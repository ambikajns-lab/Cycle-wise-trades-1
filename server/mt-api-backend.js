/**
 * MT4/MT5 API Backend für CycleWise Trades
 * 
 * Start: node server/mt-api-backend.js
 */

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// MetaApi Token (von https://metaapi.cloud)
const METAAPI_TOKEN = process.env.METAAPI_TOKEN;

// Speicher für verbundene Accounts
const connectedAccounts = new Map();

/**
 * Verbinde MT4/MT5 Account
 */
app.post('/api/mt/connect', async (req, res) => {
  const { accountNumber, password, server, platform, propFirm } = req.body;

  if (!accountNumber || !password || !server) {
    return res.status(400).json({ 
      success: false, 
      error: 'Kontonummer, Passwort und Server erforderlich' 
    });
  }

  // Demo-Modus (ohne MetaApi Token)
  const accountId = `acc_${accountNumber}_${Date.now()}`;
  
  connectedAccounts.set(accountId, {
    accountNumber,
    server,
    platform,
    propFirm,
    connectedAt: new Date().toISOString(),
  });

  console.log(`✅ Account ${accountNumber}@${server} verbunden (ID: ${accountId})`);

  res.json({
    success: true,
    accountId,
    message: METAAPI_TOKEN ? 'Live-Verbindung' : 'Demo-Modus aktiv',
    demo: !METAAPI_TOKEN,
  });
});

/**
 * Hole Account-Daten
 */
app.get('/api/mt/account/:accountId', async (req, res) => {
  const { accountId } = req.params;
  const account = connectedAccounts.get(accountId);

  if (!account) {
    return res.status(404).json({ success: false, error: 'Account nicht gefunden' });
  }

  // Demo-Daten (in Production: echte MT4/MT5 Daten via MetaApi)
  res.json({
    success: true,
    demo: !METAAPI_TOKEN,
    data: METAAPI_TOKEN ? null : {
      balance: null,
      equity: null,
      profit: null,
      message: 'Für echte Daten: METAAPI_TOKEN setzen',
    }
  });
});

/**
 * Health Check
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    mode: METAAPI_TOKEN ? 'live' : 'demo',
    accounts: connectedAccounts.size,
    timestamp: new Date().toISOString(),
  });
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🏦 CycleWise MT4/MT5 API Backend                        ║
║                                                           ║
║   Server: http://localhost:${PORT}                          ║
║   Mode: ${METAAPI_TOKEN ? '🟢 LIVE' : '🟡 DEMO'}                                        ║
║                                                           ║
║   Endpoints:                                              ║
║   POST /api/mt/connect      - Account verbinden           ║
║   GET  /api/mt/account/:id  - Account-Daten               ║
║   GET  /api/health          - Status                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
