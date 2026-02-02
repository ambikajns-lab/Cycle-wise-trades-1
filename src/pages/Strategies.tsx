import { motion } from "framer-motion";
import { Plus, CheckCircle, Settings, TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockStrategies = [
  {
    id: "1",
    name: "ICT Silver Bullet",
    markets: ["Forex", "Indices"],
    timeframes: ["1H", "15M"],
    winRate: 72,
    avgR: 2.1,
    tradesCount: 45,
    confirmations: ["Market structure shift", "FVG/OB mitigation", "Kill zone timing", "Volume confirmation", "Higher timeframe bias"],
    score: 87,
  },
  {
    id: "2",
    name: "SMC Sweep & Grab",
    markets: ["Forex"],
    timeframes: ["4H", "1H"],
    winRate: 65,
    avgR: 1.8,
    tradesCount: 32,
    confirmations: ["Liquidity sweep", "Order block reaction", "Break of structure", "Displacement candle"],
    score: 74,
  },
  {
    id: "3",
    name: "Supply & Demand",
    markets: ["Crypto", "Indices"],
    timeframes: ["Daily", "4H"],
    winRate: 58,
    avgR: 1.5,
    tradesCount: 28,
    confirmations: ["Fresh zone", "Trend alignment", "Multiple rejections", "Volume spike"],
    score: 62,
  },
];

export default function Strategies() {
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
            <h1 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">Strategy Builder</h1>
            <p className="mt-1 text-muted-foreground">Define, track, and optimize your trading strategies</p>
          </div>
          <div className="flex gap-2">
            <Button variant="hero" onClick={() => window.location.href = '/strategies/list'}>
              <Plus className="h-4 w-4" />
              Manage strategies
            </Button>
            <Button variant="outline">
              <Plus className="h-4 w-4" />
              New Strategy
            </Button>
          </div>
        </div>

        {/* Strategy Cards */}
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {mockStrategies.map((strategy, index) => (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-2xl bg-card p-6 shadow-card transition-all hover:shadow-glow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground">{strategy.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {strategy.markets.map(market => (
                      <span key={market} className="rounded-lg bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                        {market}
                      </span>
                    ))}
                    {strategy.timeframes.map(tf => (
                      <span key={tf} className="rounded-lg bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {tf}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary">
                  <span className="text-lg font-bold text-primary">{strategy.score}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl bg-muted/30 p-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                  <p className="mt-1 text-lg font-bold text-foreground">{strategy.winRate}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Avg R</p>
                  <p className="mt-1 text-lg font-bold text-foreground">{strategy.avgR}R</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Trades</p>
                  <p className="mt-1 text-lg font-bold text-foreground">{strategy.tradesCount}</p>
                </div>
              </div>

              {/* Confirmations */}
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confirmation Checklist</p>
                <div className="mt-3 space-y-2">
                  {strategy.confirmations.slice(0, 3).map((conf, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle className="h-4 w-4 text-accent-foreground" />
                      {conf}
                    </div>
                  ))}
                  {strategy.confirmations.length > 3 && (
                    <p className="text-xs text-muted-foreground">+{strategy.confirmations.length - 3} more confirmations</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 rounded-2xl bg-gradient-to-br from-secondary/50 to-accent/30 p-6"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-card p-3">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">AI Strategy Insight</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Your "ICT Silver Bullet" strategy performs 34% better during your Follicular phase compared to other phases. 
                Consider prioritizing this strategy during days 6-12 of your cycle for optimal results.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}