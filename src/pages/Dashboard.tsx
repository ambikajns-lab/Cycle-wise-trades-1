import { useState } from "react";
import { motion } from "framer-motion";
import { CyclePhaseIndicator } from "@/components/CyclePhaseIndicator";
import { SafetyModeToggle } from "@/components/SafetyModeToggle";
import { PerformanceCard } from "@/components/PerformanceCard";
import { AIInsightCard } from "@/components/AIInsightCard";
import { QuickTradeEntry } from "@/components/QuickTradeEntry";
import { RecentTradesTable } from "@/components/RecentTradesTable";
import { LeaderboardPreview } from "@/components/LeaderboardPreview";
import { PropFirmSummary } from "@/components/PropFirmSummary";
import { Bell, User } from "lucide-react";

// Mock data for demonstration
const mockTrades = [
  { id: "1", date: "Jan 24", instrument: "EUR/USD", direction: "long" as const, result: "win" as const, rMultiple: 2.1, strategy: "ICT", cyclePhase: "Follicular" },
  { id: "2", date: "Jan 23", instrument: "GBP/JPY", direction: "short" as const, result: "loss" as const, rMultiple: -1, strategy: "SMC", cyclePhase: "Follicular" },
  { id: "3", date: "Jan 22", instrument: "NAS100", direction: "long" as const, result: "win" as const, rMultiple: 1.5, strategy: "ICT", cyclePhase: "Ovulation" },
  { id: "4", date: "Jan 21", instrument: "XAU/USD", direction: "short" as const, result: "breakeven" as const, rMultiple: 0, strategy: "SMC", cyclePhase: "Ovulation" },
];

const mockLeaderboard = [
  { rank: 1, name: "Sarah M.", avatar: "👩‍💼", score: 847, badge: "Miss Discipline" },
  { rank: 2, name: "Emma K.", avatar: "👩‍🎤", score: 792, badge: "Cycle Master" },
  { rank: 3, name: "Luna P.", avatar: "👩‍🔬", score: 756 },
];

export default function Dashboard() {
  const [safetyModeEnabled, setSafetyModeEnabled] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <main className="pb-24 pt-20 lg:pl-64 lg:pt-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-7xl p-4 lg:p-8"
      >
        {/* Header */}
        <motion.header variants={itemVariants} className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">
              Good morning, Trader ✨
            </h1>
            <p className="mt-1 text-muted-foreground">
              Let's make today profitable and aligned with your body.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-xl bg-card p-2.5 text-muted-foreground shadow-soft hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
              <User className="h-5 w-5" />
            </button>
          </div>
        </motion.header>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Cycle & Safety */}
          <motion.div variants={itemVariants} className="space-y-6 lg:col-span-2">
            <CyclePhaseIndicator
              phase="follicular"
              day={8}
              recommendation="High energy phase! Great for learning new strategies and placing high-confidence trades."
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <PerformanceCard
                title="Monthly P&L"
                value={2847}
                change={12.5}
                type="currency"
              />
              <PerformanceCard
                title="Win Rate"
                value={68}
                change={5}
                type="percentage"
                icon="percent"
              />
              <PerformanceCard
                title="Avg R"
                value={1.8}
                change={8}
                type="ratio"
                icon="target"
              />
              <PerformanceCard
                title="Trades"
                value={24}
                type="count"
              />
            </div>

            <AIInsightCard
              insight="Your win rate increases by 42% when you trade during your Follicular phase with volume confirmation. Consider adding this to your checklist."
              category="pattern"
              actionLabel="View Full Analysis"
            />

            <RecentTradesTable trades={mockTrades} />
          </motion.div>

          {/* Right Column - Actions & Widgets */}
          <motion.div variants={itemVariants} className="space-y-6">
            <SafetyModeToggle
              enabled={safetyModeEnabled}
              onToggle={setSafetyModeEnabled}
              suggested={false}
            />

            <QuickTradeEntry
              onNewTrade={() => console.log("New trade")}
              safetyModeEnabled={safetyModeEnabled}
            />

            <PropFirmSummary
              totalExpenses={2450}
              totalPayouts={8920}
              netProfit={6470}
              roi={264}
            />

            <LeaderboardPreview
              entries={mockLeaderboard}
              type="discipline"
              currentUserRank={12}
            />
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}