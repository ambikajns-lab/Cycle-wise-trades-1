import { motion } from "framer-motion";
import { Building2, Plus, TrendingUp, TrendingDown, DollarSign, Activity, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PropFirmConnect from "@/components/PropFirmConnect";

type PropFirmAccount = {
  id: string;
  propFirm: string;
  accountNumber: string;
  password: string;
  server: string;
  platform: 'mt4' | 'mt5';
  lastSync?: string;
  status: 'connected' | 'syncing' | 'error' | 'disconnected';
  balance?: number;
  equity?: number;
  dailyPnl?: number;
  trades?: number;
  openTrades?: number;
  profit?: number;
};

export default function PropFirmAccounts() {
  const [accounts, setAccounts] = useState<PropFirmAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cw_propfirm_accounts');
      if (saved) {
        setAccounts(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load prop firm accounts:', e);
    }
    setIsLoading(false);
  }, []);

  // Listen for storage changes (when accounts are added/synced)
  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('cw_propfirm_accounts');
      if (saved) {
        setAccounts(JSON.parse(saved));
      }
    };

    window.addEventListener('storage', handleStorage);
    
    // Also poll for changes every second (for same-tab updates)
    const interval = setInterval(() => {
      const saved = localStorage.getItem('cw_propfirm_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (JSON.stringify(parsed) !== JSON.stringify(accounts)) {
          setAccounts(parsed);
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, [accounts]);

  // Calculate totals - only count accounts with actual data
  const totals = accounts.reduce((acc, account) => {
    if (account.status === 'connected' && account.balance) {
      acc.totalBalance += account.balance || 0;
      acc.totalEquity += account.equity || 0;
      acc.totalDailyPnl += account.dailyPnl || 0;
      acc.totalTrades += account.trades || 0;
      acc.accountsWithData += 1;
    }
    if (account.status === 'connected') {
      acc.connectedAccounts += 1;
    }
    return acc;
  }, {
    totalBalance: 0,
    totalEquity: 0,
    totalDailyPnl: 0,
    totalTrades: 0,
    connectedAccounts: 0,
    accountsWithData: 0,
  });

  return (
    <main className="pb-24 pt-20 lg:pl-64 lg:pt-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-6xl p-4 lg:p-8"
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground lg:text-3xl flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-500" />
              Prop Firm Accounts
            </h1>
            <p className="mt-1 text-muted-foreground">
              Verbinde und verwalte alle deine Prop Firm Trading-Accounts
            </p>
          </div>
        </div>

        {/* Stats Overview - Only show if there are accounts with actual data */}
        {totals.accountsWithData > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {/* Total Balance */}
            <div className="rounded-2xl bg-card p-5 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-xl bg-blue-500/20 p-2.5">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                </div>
                <span className="text-sm text-muted-foreground">Gesamt Balance</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                ${totals.totalBalance.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {totals.connectedAccounts} Account{totals.connectedAccounts !== 1 ? 's' : ''} verbunden
              </p>
            </div>

            {/* Total Equity */}
            <div className="rounded-2xl bg-card p-5 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-xl bg-purple-500/20 p-2.5">
                  <Activity className="h-5 w-5 text-purple-500" />
                </div>
                <span className="text-sm text-muted-foreground">Gesamt Equity</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                ${totals.totalEquity.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
              </p>
              <p className={`text-xs mt-1 ${totals.totalEquity >= totals.totalBalance ? 'text-green-600' : 'text-red-600'}`}>
                {totals.totalEquity >= totals.totalBalance ? '📈' : '📉'} {((totals.totalEquity / totals.totalBalance - 1) * 100).toFixed(2)}% vom Start
              </p>
            </div>

            {/* Daily P&L */}
            <div className="rounded-2xl bg-card p-5 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className={`rounded-xl p-2.5 ${totals.totalDailyPnl >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {totals.totalDailyPnl >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <span className="text-sm text-muted-foreground">Heute</span>
              </div>
              <p className={`text-2xl font-bold ${totals.totalDailyPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totals.totalDailyPnl >= 0 ? '+' : ''}${totals.totalDailyPnl.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Tages-Performance
              </p>
            </div>

            {/* Total Trades */}
            <div className="rounded-2xl bg-card p-5 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-xl bg-orange-500/20 p-2.5">
                  <RefreshCw className="h-5 w-5 text-orange-500" />
                </div>
                <span className="text-sm text-muted-foreground">Trades heute</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {totals.totalTrades}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                über alle Accounts
              </p>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-card p-6 shadow-card"
        >
          <PropFirmConnect />
        </motion.div>

        {/* Info Section */}
        {accounts.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-6"
          >
            <h3 className="font-semibold text-foreground mb-2">💡 So funktioniert's</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">1. Prop Firm wählen</strong> - Suche deine Prop Firm in der Liste (FTMO, The5ers, E8, etc.)
              </p>
              <p>
                <strong className="text-foreground">2. MT4/MT5 Daten eingeben</strong> - Kontonummer, Investor-Passwort und Server aus deiner Prop Firm E-Mail
              </p>
              <p>
                <strong className="text-foreground">3. Automatische Synchronisierung</strong> - Deine Trades werden automatisch importiert und analysiert
              </p>
            </div>
            
            <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-700 dark:text-green-400">
                🔒 <strong>100% Sicher:</strong> Mit dem Investor-Passwort können wir nur lesen - niemals traden oder Geld abheben.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
