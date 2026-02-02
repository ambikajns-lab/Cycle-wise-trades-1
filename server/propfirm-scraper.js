/**
 * Prop Firm Scraper API
 * 
 * This server handles automated login and data scraping from prop firm dashboards.
 * Uses Puppeteer for browser automation.
 * 
 * IMPORTANT: Run this on a secure backend server, never expose credentials!
 * 
 * Usage:
 *   npm install express puppeteer crypto-js cors
 *   node server/propfirm-scraper.js
 */

const express = require('express');
const puppeteer = require('puppeteer');
const CryptoJS = require('crypto-js');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Encryption key - in production, use environment variable!
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'cyclewise-trades-secret-key-change-in-production';

// Decrypt credentials
function decryptCredentials(encryptedPassword) {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return encryptedPassword; // Return as-is if not encrypted
  }
}

// Encrypt credentials (for storing)
function encryptCredentials(password) {
  return CryptoJS.AES.encrypt(password, ENCRYPTION_KEY).toString();
}

/**
 * FTMO Scraper
 * Logs into FTMO dashboard and extracts account data
 */
async function scrapeFTMO(email, password, accountNumber = null) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Navigate to FTMO login
    console.log('📡 Navigating to FTMO login...');
    await page.goto('https://trader.ftmo.com/login', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Wait for login form
    await page.waitForSelector('input[name="email"]', { timeout: 10000 });
    
    // Enter credentials
    console.log('🔐 Entering credentials...');
    await page.type('input[name="email"]', email, { delay: 50 });
    await page.type('input[name="password"]', password, { delay: 50 });
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    console.log('⏳ Waiting for dashboard...');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
    
    // Check if login was successful
    const currentUrl = page.url();
    if (currentUrl.includes('login')) {
      throw new Error('Login failed - check credentials');
    }

    console.log('✅ Login successful, scraping data...');

    // Wait for account data to load
    await page.waitForSelector('.account-balance, .balance, [data-balance]', { timeout: 15000 }).catch(() => {});
    
    // Extract account data
    const accountData = await page.evaluate((targetAccountNumber) => {
      // Helper to extract number from text
      const extractNumber = (text) => {
        if (!text) return null;
        const match = text.replace(/[^0-9.-]/g, '');
        return match ? parseFloat(match) : null;
      };

      // Try to find balance elements (FTMO uses various selectors)
      const findValue = (selectors) => {
        for (const selector of selectors) {
          const el = document.querySelector(selector);
          if (el) return extractNumber(el.textContent);
        }
        return null;
      };

      // Common selectors for FTMO dashboard
      const balance = findValue([
        '.account-balance',
        '.balance-value',
        '[data-balance]',
        '.stat-balance .value',
        '.account-info .balance'
      ]);

      const equity = findValue([
        '.account-equity',
        '.equity-value',
        '[data-equity]',
        '.stat-equity .value'
      ]);

      const dailyPnl = findValue([
        '.daily-pnl',
        '.today-pnl',
        '[data-daily-pnl]',
        '.stat-daily .value'
      ]);

      const totalPnl = findValue([
        '.total-pnl',
        '.profit-loss',
        '[data-total-pnl]'
      ]);

      // Get trade count
      const tradesEl = document.querySelector('.trades-count, .open-trades, [data-trades]');
      const trades = tradesEl ? parseInt(tradesEl.textContent) || 0 : 0;

      // Get account number if visible
      const accountEl = document.querySelector('.account-number, .account-id, [data-account]');
      const accountNum = accountEl ? accountEl.textContent.trim() : null;

      // Get account status (Challenge, Verification, Funded)
      const statusEl = document.querySelector('.account-status, .status-badge, [data-status]');
      const status = statusEl ? statusEl.textContent.trim() : 'Unknown';

      // Get drawdown info
      const maxDrawdown = findValue(['.max-drawdown', '.drawdown-limit', '[data-max-drawdown]']);
      const currentDrawdown = findValue(['.current-drawdown', '.drawdown-current', '[data-drawdown]']);

      // Get profit target
      const profitTarget = findValue(['.profit-target', '.target', '[data-target]']);
      const currentProfit = findValue(['.current-profit', '.profit', '[data-profit]']);

      return {
        accountNumber: accountNum || targetAccountNumber,
        status,
        balance,
        equity,
        dailyPnl,
        totalPnl,
        trades,
        maxDrawdown,
        currentDrawdown,
        profitTarget,
        currentProfit,
        scrapedAt: new Date().toISOString()
      };
    }, accountNumber);

    // Try to get recent trades
    let recentTrades = [];
    try {
      await page.goto('https://trader.ftmo.com/trades', { waitUntil: 'networkidle2', timeout: 20000 });
      await page.waitForSelector('table, .trades-table', { timeout: 5000 });
      
      recentTrades = await page.evaluate(() => {
        const rows = document.querySelectorAll('table tbody tr, .trade-row');
        return Array.from(rows).slice(0, 10).map(row => {
          const cells = row.querySelectorAll('td, .cell');
          return {
            symbol: cells[0]?.textContent?.trim() || '',
            type: cells[1]?.textContent?.trim() || '',
            size: cells[2]?.textContent?.trim() || '',
            openPrice: cells[3]?.textContent?.trim() || '',
            closePrice: cells[4]?.textContent?.trim() || '',
            pnl: cells[5]?.textContent?.trim() || '',
            date: cells[6]?.textContent?.trim() || ''
          };
        });
      });
    } catch (e) {
      console.log('Could not fetch recent trades:', e.message);
    }

    return {
      success: true,
      propFirm: 'ftmo',
      ...accountData,
      recentTrades
    };

  } catch (error) {
    console.error('❌ FTMO scrape error:', error.message);
    return {
      success: false,
      propFirm: 'ftmo',
      error: error.message
    };
  } finally {
    await browser.close();
  }
}

/**
 * The5ers Scraper
 */
async function scrapeThe5ers(email, password, accountNumber = null) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    console.log('📡 Navigating to The5ers login...');
    await page.goto('https://trader.the5ers.com/login', { waitUntil: 'networkidle2', timeout: 30000 });
    
    await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });
    
    await page.type('input[type="email"], input[name="email"]', email, { delay: 50 });
    await page.type('input[type="password"], input[name="password"]', password, { delay: 50 });
    
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });

    console.log('✅ Login successful, scraping The5ers data...');

    const accountData = await page.evaluate(() => {
      const extractNumber = (text) => {
        if (!text) return null;
        const match = text.replace(/[^0-9.-]/g, '');
        return match ? parseFloat(match) : null;
      };

      // The5ers specific selectors
      const findValue = (selectors) => {
        for (const selector of selectors) {
          const el = document.querySelector(selector);
          if (el) return extractNumber(el.textContent);
        }
        return null;
      };

      return {
        balance: findValue(['.balance', '.account-balance', '[data-balance]', '.stat-value']),
        equity: findValue(['.equity', '.account-equity', '[data-equity]']),
        dailyPnl: findValue(['.daily-pnl', '.today-profit', '[data-daily]']),
        trades: parseInt(document.querySelector('.trades-count, .open-positions')?.textContent) || 0,
        drawdown: findValue(['.drawdown', '.max-dd', '[data-drawdown]']),
        profitTarget: findValue(['.profit-target', '.target', '[data-target]']),
        scrapedAt: new Date().toISOString()
      };
    });

    return {
      success: true,
      propFirm: 'the5ers',
      accountNumber,
      ...accountData
    };

  } catch (error) {
    return { success: false, propFirm: 'the5ers', error: error.message };
  } finally {
    await browser.close();
  }
}

/**
 * E8 Funding Scraper
 */
async function scrapeE8Funding(email, password, accountNumber = null) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    console.log('📡 Navigating to E8 Funding login...');
    await page.goto('https://portal.e8funding.com/login', { waitUntil: 'networkidle2', timeout: 30000 });
    
    await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });
    
    await page.type('input[type="email"], input[name="email"]', email, { delay: 50 });
    await page.type('input[type="password"], input[name="password"]', password, { delay: 50 });
    
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });

    console.log('✅ Login successful, scraping E8 data...');

    const accountData = await page.evaluate(() => {
      const extractNumber = (text) => {
        if (!text) return null;
        const match = text.replace(/[^0-9.-]/g, '');
        return match ? parseFloat(match) : null;
      };

      return {
        balance: extractNumber(document.querySelector('.balance, .account-balance, [data-balance]')?.textContent),
        equity: extractNumber(document.querySelector('.equity, [data-equity]')?.textContent),
        dailyPnl: extractNumber(document.querySelector('.daily-pnl, .pnl-today')?.textContent),
        trades: parseInt(document.querySelector('.trades, .positions')?.textContent) || 0,
        scrapedAt: new Date().toISOString()
      };
    });

    return {
      success: true,
      propFirm: 'e8funding',
      accountNumber,
      ...accountData
    };

  } catch (error) {
    return { success: false, propFirm: 'e8funding', error: error.message };
  } finally {
    await browser.close();
  }
}

/**
 * Funded Next Scraper
 */
async function scrapeFundedNext(email, password, accountNumber = null) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    console.log('📡 Navigating to Funded Next login...');
    await page.goto('https://portal.fundednext.com/login', { waitUntil: 'networkidle2', timeout: 30000 });
    
    await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });
    
    await page.type('input[type="email"], input[name="email"]', email, { delay: 50 });
    await page.type('input[type="password"], input[name="password"]', password, { delay: 50 });
    
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });

    const accountData = await page.evaluate(() => {
      const extractNumber = (text) => {
        if (!text) return null;
        const match = text.replace(/[^0-9.-]/g, '');
        return match ? parseFloat(match) : null;
      };

      return {
        balance: extractNumber(document.querySelector('.balance, [data-balance]')?.textContent),
        equity: extractNumber(document.querySelector('.equity, [data-equity]')?.textContent),
        dailyPnl: extractNumber(document.querySelector('.daily-pnl, .today')?.textContent),
        trades: parseInt(document.querySelector('.trades')?.textContent) || 0,
        scrapedAt: new Date().toISOString()
      };
    });

    return {
      success: true,
      propFirm: 'fundednext',
      accountNumber,
      ...accountData
    };

  } catch (error) {
    return { success: false, propFirm: 'fundednext', error: error.message };
  } finally {
    await browser.close();
  }
}

/**
 * Funding Pips Scraper
 */
async function scrapeFundingPips(email, password, accountNumber = null) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    console.log('📡 Navigating to Funding Pips login...');
    await page.goto('https://app.fundingpips.com/login', { waitUntil: 'networkidle2', timeout: 30000 });
    
    await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });
    
    await page.type('input[type="email"], input[name="email"]', email, { delay: 50 });
    await page.type('input[type="password"], input[name="password"]', password, { delay: 50 });
    
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });

    const accountData = await page.evaluate(() => {
      const extractNumber = (text) => {
        if (!text) return null;
        const match = text.replace(/[^0-9.-]/g, '');
        return match ? parseFloat(match) : null;
      };

      return {
        balance: extractNumber(document.querySelector('.balance, [data-balance]')?.textContent),
        equity: extractNumber(document.querySelector('.equity, [data-equity]')?.textContent),
        dailyPnl: extractNumber(document.querySelector('.daily-pnl')?.textContent),
        trades: parseInt(document.querySelector('.trades')?.textContent) || 0,
        scrapedAt: new Date().toISOString()
      };
    });

    return {
      success: true,
      propFirm: 'fundingpips',
      accountNumber,
      ...accountData
    };

  } catch (error) {
    return { success: false, propFirm: 'fundingpips', error: error.message };
  } finally {
    await browser.close();
  }
}

/**
 * Generic scraper factory
 */
const SCRAPERS = {
  ftmo: scrapeFTMO,
  the5ers: scrapeThe5ers,
  e8funding: scrapeE8Funding,
  fundednext: scrapeFundedNext,
  myfundedfx: scrapeMyFundedFX,
  fundingpips: scrapeFundingPips,
  // Planned
  thefundedtrader: async () => ({ success: false, error: 'Not implemented yet' }),
  alphacapital: async () => ({ success: false, error: 'Not implemented yet' }),
  apex: async () => ({ success: false, error: 'Not implemented yet' }),
  topstep: async () => ({ success: false, error: 'Not implemented yet' }),
  luxtrading: async () => ({ success: false, error: 'Not implemented yet' }),
  citytraders: async () => ({ success: false, error: 'Not implemented yet' }),
};

// ============== API ROUTES ==============

/**
 * POST /api/propfirm/sync
 * Sync a single prop firm account
 */
app.post('/api/propfirm/sync', async (req, res) => {
  const { propFirm, email, password, accountNumber } = req.body;

  if (!propFirm || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields: propFirm, email, password' 
    });
  }

  const scraper = SCRAPERS[propFirm.toLowerCase()];
  if (!scraper) {
    return res.status(400).json({ 
      success: false, 
      error: `Unsupported prop firm: ${propFirm}` 
    });
  }

  console.log(`\n🔄 Syncing ${propFirm} account for ${email}...`);
  
  try {
    const decryptedPassword = decryptCredentials(password);
    const result = await scraper(email, decryptedPassword, accountNumber);
    
    if (result.success) {
      console.log(`✅ ${propFirm} sync successful`);
    } else {
      console.log(`❌ ${propFirm} sync failed: ${result.error}`);
    }
    
    res.json(result);
  } catch (error) {
    console.error(`❌ Sync error:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/propfirm/encrypt
 * Encrypt credentials for secure storage
 */
app.post('/api/propfirm/encrypt', (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }

  const encrypted = encryptCredentials(password);
  res.json({ encrypted });
});

/**
 * GET /api/propfirm/supported
 * List supported prop firms
 */
app.get('/api/propfirm/supported', (req, res) => {
  res.json({
    supported: Object.keys(SCRAPERS),
    implemented: ['ftmo', 'myfundedfx'],
    comingSoon: ['thefundedtrader', 'apex', 'topstep', 'trueforexfunds']
  });
});

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🏦 CycleWise Prop Firm Scraper API                     ║
║                                                          ║
║   Server running on http://localhost:${PORT}               ║
║                                                          ║
║   Endpoints:                                             ║
║   POST /api/propfirm/sync     - Sync account data        ║
║   POST /api/propfirm/encrypt  - Encrypt credentials      ║
║   GET  /api/propfirm/supported - List prop firms         ║
║   GET  /api/health            - Health check             ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
  `);
});

module.exports = { app, SCRAPERS, encryptCredentials, decryptCredentials };
