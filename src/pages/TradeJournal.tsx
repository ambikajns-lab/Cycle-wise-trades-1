import { motion } from "framer-motion";
import { Plus, Filter, Download, TrendingUp, TrendingDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const mockTrades = [
  { id: "1", date: "2025-01-24", time: "09:32", instrument: "EUR/USD", direction: "long", entry: 1.0845, sl: 1.0820, tp: 1.0895, result: "win", pnl: 450, rMultiple: 2.1, strategy: "ICT Silver Bullet", emotions: "Calm", cyclePhase: "Follicular", confirmations: 4 },
  { id: "2", date: "2025-01-23", time: "14:15", instrument: "GBP/JPY", direction: "short", entry: 188.45, sl: 189.00, tp: 187.20, result: "loss", pnl: -215, rMultiple: -1, strategy: "SMC Sweep", emotions: "Anxious", cyclePhase: "Follicular", confirmations: 2 },
  { id: "3", date: "2025-01-22", time: "10:00", instrument: "NAS100", direction: "long", entry: 17850, sl: 17800, tp: 17950, result: "win", pnl: 380, rMultiple: 1.5, strategy: "ICT Silver Bullet", emotions: "Focused", cyclePhase: "Ovulation", confirmations: 5 },
  { id: "4", date: "2025-01-21", time: "15:45", instrument: "XAU/USD", direction: "short", entry: 2028, sl: 2035, tp: 2012, result: "breakeven", pnl: 0, rMultiple: 0, strategy: "SMC Sweep", emotions: "Neutral", cyclePhase: "Ovulation", confirmations: 3 },
  { id: "5", date: "2025-01-20", time: "08:20", instrument: "EUR/USD", direction: "long", entry: 1.0890, sl: 1.0860, tp: 1.0950, result: "win", pnl: 520, rMultiple: 2.3, strategy: "ICT Silver Bullet", emotions: "Confident", cyclePhase: "Ovulation", confirmations: 5 },
];

export default function TradeJournal() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTrades = mockTrades.filter(trade => 
    trade.instrument.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trade.strategy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getResultBadge = (result: string, pnl: number) => {
    const styles = {
      win: "bg-accent/50 text-accent-foreground",
      loss: "bg-destructive/10 text-destructive",
      breakeven: "bg-muted text-muted-foreground",
    };
    return (
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[result as keyof typeof styles]}`}>
          {result}
        </span>
        <span className={`text-sm font-semibold ${pnl > 0 ? "text-accent-foreground" : pnl < 0 ? "text-destructive" : "text-muted-foreground"}`}>
          {pnl > 0 ? "+" : ""}{pnl > 0 ? "$" : "-$"}{Math.abs(pnl)}
        </span>
      </div>
    );
  };

  return (
    <main className="pb-24 pt-20 lg:pl-64 lg:pt-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-7xl p-4 lg:p-8"
      >
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">Trade Journal</h1>
            <p className="mt-1 text-muted-foreground">Track and analyze your trading performance</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="hero" size="sm">
              <Plus className="h-4 w-4" />
              New Trade
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          {[
            { label: "Total Trades", value: "147", trend: "+12 this month" },
            { label: "Win Rate", value: "68%", trend: "+5% vs last month" },
            { label: "Total P&L", value: "$12,450", trend: "+$2,847 this month" },
            { label: "Best R-Multiple", value: "3.2R", trend: "ICT Strategy" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-card p-5 shadow-card"
            >
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.trend}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search trades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Trades Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-card shadow-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Instrument</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Direction</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Result</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">R</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Strategy</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Phase</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden xl:table-cell">Confirmations</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrades.map((trade, index) => (
                  <motion.tr
                    key={trade.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{trade.date}</p>
                        <p className="text-xs text-muted-foreground">{trade.time}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-foreground">{trade.instrument}</td>
                    <td className="px-4 py-4">
                      <div className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ${
                        trade.direction === "long" ? "bg-accent/30 text-accent-foreground" : "bg-destructive/10 text-destructive"
                      }`}>
                        {trade.direction === "long" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {trade.direction}
                      </div>
                    </td>
                    <td className="px-4 py-4">{getResultBadge(trade.result, trade.pnl)}</td>
                    <td className={`px-4 py-4 text-sm font-bold ${
                      trade.rMultiple > 0 ? "text-accent-foreground" : trade.rMultiple < 0 ? "text-destructive" : "text-muted-foreground"
                    }`}>
                      {trade.rMultiple > 0 ? "+" : ""}{trade.rMultiple}R
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground hidden lg:table-cell">{trade.strategy}</td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-xs text-muted-foreground">{trade.cyclePhase}</span>
                    </td>
                    <td className="px-4 py-4 hidden xl:table-cell">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 w-2 rounded-full ${
                              i < trade.confirmations ? "bg-primary" : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}