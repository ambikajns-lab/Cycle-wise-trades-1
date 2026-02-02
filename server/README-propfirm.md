# Prop Firm Scraper API

Backend-Service für automatische Synchronisierung von Prop Firm Account-Daten.

## Installation

```bash
cd server
npm install express puppeteer crypto-js cors
```

## Starten

```bash
# Development
node server/propfirm-scraper.js

# Mit Environment Variables
ENCRYPTION_KEY=dein-geheimer-key PORT=3001 node server/propfirm-scraper.js
```

## API Endpoints

### POST /api/propfirm/sync
Synchronisiert Account-Daten von einer Prop Firm.

**Request:**
```json
{
  "propFirm": "ftmo",
  "email": "deine@email.com",
  "password": "dein-passwort",
  "accountNumber": "123456" // optional
}
```

**Response:**
```json
{
  "success": true,
  "propFirm": "ftmo",
  "accountNumber": "123456",
  "status": "Funded",
  "balance": 100000.00,
  "equity": 102500.50,
  "dailyPnl": 1250.00,
  "totalPnl": 5000.00,
  "trades": 5,
  "maxDrawdown": 10000,
  "currentDrawdown": 500,
  "profitTarget": 10000,
  "currentProfit": 5000,
  "scrapedAt": "2026-01-28T12:00:00.000Z",
  "recentTrades": [...]
}
```

### POST /api/propfirm/encrypt
Verschlüsselt Passwörter für sichere Speicherung.

**Request:**
```json
{
  "password": "mein-passwort"
}
```

**Response:**
```json
{
  "encrypted": "U2FsdGVkX1..."
}
```

### GET /api/propfirm/supported
Liste aller unterstützten Prop Firms.

**Response:**
```json
{
  "supported": ["ftmo", "myfundedfx", "thefundedtrader", "apex", "topstep", "trueforexfunds"],
  "implemented": ["ftmo", "myfundedfx"],
  "comingSoon": ["thefundedtrader", "apex", "topstep", "trueforexfunds"]
}
```

## Unterstützte Prop Firms

| Prop Firm | Status | Notes |
|-----------|--------|-------|
| FTMO | ✅ Implementiert | Vollständig unterstützt |
| MyFundedFX | ✅ Implementiert | Basis-Support |
| The Funded Trader | 🔜 Geplant | Coming Soon |
| Apex Trader Funding | 🔜 Geplant | Coming Soon |
| Topstep | 🔜 Geplant | Coming Soon |
| True Forex Funds | 🔜 Geplant | Coming Soon |

## Sicherheitshinweise

⚠️ **WICHTIG für Production:**

1. **ENCRYPTION_KEY**: Setze einen starken, einzigartigen Key als Environment Variable
2. **HTTPS**: Verwende HTTPS für alle API-Calls
3. **Rate Limiting**: Implementiere Rate Limiting um Account-Sperren zu vermeiden
4. **IP Rotation**: Nutze Proxies für Scraping in Production
5. **Keine Client-Side Speicherung**: Speichere Passwörter NIE im Frontend localStorage unverschlüsselt

## Frontend Integration

Das Frontend verbindet sich automatisch mit dem Backend unter `VITE_PROPFIRM_API_URL` oder `http://localhost:3001`.

```env
# .env
VITE_PROPFIRM_API_URL=https://api.deine-domain.com
```

Falls das Backend nicht erreichbar ist, verwendet das Frontend Mock-Daten für Demo-Zwecke.

## Architektur

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│  React Frontend │────▶│  Scraper API     │────▶│  FTMO Dashboard │
│  (PropFirmConnect)    │  (Node + Puppeteer)    │                 │
│                 │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │
         │                       ▼
         │              ┌──────────────────┐
         │              │                  │
         └─────────────▶│  localStorage    │
                        │  (Account List)  │
                        │                  │
                        └──────────────────┘
```

## Entwicklung

### Neue Prop Firm hinzufügen

1. Erstelle eine neue Scraper-Funktion in `propfirm-scraper.js`:

```javascript
async function scrapeNewPropFirm(email, password, accountNumber) {
  const browser = await puppeteer.launch({ headless: 'new' });
  
  try {
    const page = await browser.newPage();
    // ... Login und Scraping Logik
    return { success: true, ... };
  } finally {
    await browser.close();
  }
}
```

2. Registriere den Scraper:

```javascript
const SCRAPERS = {
  // ...existing
  newpropfirm: scrapeNewPropFirm,
};
```

3. Füge die Prop Firm zum Frontend hinzu in `PropFirmConnect.tsx`:

```javascript
const PROP_FIRMS = [
  // ...existing
  { id: 'newpropfirm', name: 'New Prop Firm', logo: '🆕', color: 'bg-pink-500' },
];
```

## Troubleshooting

### "Login failed - check credentials"
- Überprüfe E-Mail und Passwort
- Einige Prop Firms haben 2FA - das wird noch nicht unterstützt

### "Timeout waiting for selector"
- Die Prop Firm hat möglicherweise ihre Website geändert
- Selektoren müssen aktualisiert werden

### "Browser launch failed"
- Stelle sicher, dass Chromium installiert ist
- Bei Docker: Verwende `--no-sandbox` Flags
