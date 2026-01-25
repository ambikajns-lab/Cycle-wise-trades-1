import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Calendar, Clock, Target, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

const insights = [
  {
    id: "1",
    category: "pattern",
    title: "Entry Timing Optimization",
    insight: "Your win rate increases by 42% when you wait for candle close confirmation. You tend to enter early 67% of the time, especially during your Luteal phase.",
    actionable: "Enable 'Wait for Close' reminder in your trade entry screen.",
    impact: "High",
    icon: Clock,
  },
  {
    id: "2",
    category: "cycle",
    title: "Cycle-Phase Performance Gap",
    insight: "Your Ovulation phase shows 2.8x better R-multiples compared to Luteal phase. Consider reducing position sizes by 50% during days 17-28.",
    actionable: "Auto-enable Safety Mode during late Luteal (days 24-28).",
    impact: "Critical",
    icon: Calendar,
  },
  {
    id: "3",
    category: "strategy",
    title: "Strategy Effectiveness",
    insight: "ICT Silver Bullet has a 72% win rate vs SMC Sweep at 58%. However, SMC performs better on GBP pairs (+23% edge).",
    actionable: "Use SMC exclusively for GBP crosses.",
    impact: "Medium",
    icon: Target,
  },
  {
    id: "4",
    category: "psychology",
    title: "Emotional Trading Detected",
    insight: "After a losing trade, you have a 78% chance of entering another trade within 30 minutes. These 'revenge trades' have a 23% win rate.",
    actionable: "Enable 30-minute cooldown after losses.",
    impact: "High",
    icon: Brain,
  },
  {
    id: "5",
    category: "confirmation",
    title: "Confirmation Effectiveness",
    insight: "Volume confirmation alone accounts for 34% of your edge. Trades with volume confirmation have 1.9R avg vs 0.8R without.",
    actionable: "Make volume confirmation mandatory in your checklist.",
    impact: "High",
    icon: TrendingUp,
  },
];

const getCategoryStyles = (category: string) => {
  const styles = {
    pattern: { bg: "bg-secondary/30", text: "text-secondary-foreground", label: "Pattern" },
    cycle: { bg: "bg-primary/10", text: "text-primary", label: "Cycle" },
    strategy: { bg: "bg-accent/30", text: "text-accent-foreground", label: "Strategy" },
    psychology: { bg: "bg-destructive/10", text: "text-destructive", label: "Psychology" },
    confirmation: { bg: "bg-muted", text: "text-muted-foreground", label: "Confirmation" },
  };
  return styles[category as keyof typeof styles] || styles.pattern;
};

const getImpactStyles = (impact: string) => {
  const styles = {
    Critical: "bg-destructive/20 text-destructive",
    High: "bg-primary/20 text-primary",
    Medium: "bg-accent/50 text-accent-foreground",
    Low: "bg-muted text-muted-foreground",
  };
  return styles[impact as keyof typeof styles] || styles.Medium;
};

export default function AIInsights() {
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
            <h1 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">AI Insights</h1>
            <p className="mt-1 text-muted-foreground">Personalized analysis powered by your trading data</p>
          </div>
          <Button variant="hero">
            <Sparkles className="h-4 w-4" />
            Generate New Insights
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Insights Generated", value: "147", icon: Sparkles },
            { label: "Actions Taken", value: "89", icon: TrendingUp },
            { label: "Performance Impact", value: "+34%", icon: Target },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-card p-5 shadow-card"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2.5">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Insights List */}
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const categoryStyles = getCategoryStyles(insight.category);
            const impactStyles = getImpactStyles(insight.impact);
            const Icon = insight.icon;

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl bg-card p-6 shadow-card"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="rounded-xl bg-gradient-to-br from-secondary/50 to-accent/30 p-3">
                      <Icon className="h-6 w-6 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryStyles.bg} ${categoryStyles.text}`}>
                          {categoryStyles.label}
                        </span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${impactStyles}`}>
                          {insight.impact} Impact
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground">{insight.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{insight.insight}</p>
                      
                      <div className="mt-4 rounded-xl bg-muted/30 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Recommended Action
                        </p>
                        <p className="text-sm text-foreground">{insight.actionable}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 lg:flex-col">
                    <Button variant="default" size="sm" className="flex-1 lg:flex-none">
                      Apply
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* AI Coaching Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/30 to-accent/20 p-6"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-card p-3">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-foreground">Your AI Coach Summary</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Based on analyzing your 147 trades, I've identified that your biggest edge comes from combining 
                your ICT strategy with volume confirmation during your Follicular phase. Your main leak is 
                revenge trading after losses—addressing this alone could improve your monthly returns by an 
                estimated 18%. Focus on implementing the cooldown period and you'll see immediate results.
              </p>
              <Button variant="outline" className="mt-4">
                View Detailed Report
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}