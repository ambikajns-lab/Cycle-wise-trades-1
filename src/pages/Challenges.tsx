import { motion } from "framer-motion";
import { Trophy, Award, Medal, Shield, Calendar } from "lucide-react";

const leaderboards = [
  {
    type: "profit",
    title: "Profit Leaders",
    icon: Trophy,
    gradient: "from-amber-400/20 to-yellow-300/20",
    entries: [
      { rank: 1, name: "Sarah M.", avatar: "👩‍💼", score: "$12,450", badge: "🔥 Hot Streak" },
      { rank: 2, name: "Emma K.", avatar: "👩‍🎤", score: "$9,870" },
      { rank: 3, name: "Luna P.", avatar: "👩‍🔬", score: "$8,540" },
      { rank: 4, name: "Mia R.", avatar: "👩‍💻", score: "$7,230" },
      { rank: 5, name: "You", avatar: "✨", score: "$6,470", isCurrentUser: true },
    ],
  },
  {
    type: "discipline",
    title: "Strategy Discipline",
    icon: Award,
    gradient: "from-secondary to-accent/30",
    entries: [
      { rank: 1, name: "Nina T.", avatar: "👩‍🏫", score: "98/100", badge: "Miss Discipline" },
      { rank: 2, name: "Aria L.", avatar: "👩‍🎨", score: "95/100" },
      { rank: 3, name: "You", avatar: "✨", score: "92/100", isCurrentUser: true },
      { rank: 4, name: "Zoe W.", avatar: "👩‍⚕️", score: "89/100" },
      { rank: 5, name: "Ivy C.", avatar: "👩‍🌾", score: "87/100" },
    ],
  },
  {
    type: "risk",
    title: "Risk Masters",
    icon: Shield,
    gradient: "from-accent to-secondary/30",
    entries: [
      { rank: 1, name: "Elena V.", avatar: "👩‍🚀", score: "2.1% DD", badge: "Risk Queen" },
      { rank: 2, name: "Maya H.", avatar: "👩‍🔧", score: "3.4% DD" },
      { rank: 3, name: "Chloe S.", avatar: "👩‍🍳", score: "4.2% DD" },
      { rank: 4, name: "You", avatar: "✨", score: "5.1% DD", isCurrentUser: true },
      { rank: 5, name: "Ruby D.", avatar: "👩‍✈️", score: "5.8% DD" },
    ],
  },
  {
    type: "cycle",
    title: "Cycle-Aligned",
    icon: Calendar,
    gradient: "from-primary/20 to-secondary",
    entries: [
      { rank: 1, name: "Jade F.", avatar: "👩‍🎓", score: "+47%", badge: "Cycle Master" },
      { rank: 2, name: "Pearl B.", avatar: "👸", score: "+38%" },
      { rank: 3, name: "Rose G.", avatar: "💃", score: "+31%" },
      { rank: 4, name: "Lily A.", avatar: "🧘‍♀️", score: "+26%" },
      { rank: 5, name: "You", avatar: "✨", score: "+22%", isCurrentUser: true },
    ],
  },
];

const badges = [
  { name: "Miss Discipline", icon: "🎯", description: "100% rule adherence for 30 days", earned: true },
  { name: "Risk Queen", icon: "👑", description: "Max 3% drawdown for a month", earned: true },
  { name: "Cycle Master", icon: "🌙", description: "Best cycle-aligned performance", earned: false },
  { name: "Consistency Queen", icon: "💎", description: "Profitable 20+ days in a row", earned: false },
  { name: "Comeback Girl", icon: "🔥", description: "Recovered from 10%+ drawdown", earned: true },
];

export default function Challenges() {
  return (
    <main className="pb-24 pt-20 lg:pl-64 lg:pt-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-7xl p-4 lg:p-8"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">Monthly Challenges</h1>
          <p className="mt-1 text-muted-foreground">Compete, improve, and earn badges with the community</p>
        </div>

        {/* Challenge Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary to-accent/30 p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">January 2025 Challenge</p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-foreground">Time Remaining</h2>
            </div>
            <div className="flex gap-4">
              {[
                { value: 6, label: "Days" },
                { value: 14, label: "Hours" },
                { value: 32, label: "Mins" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="rounded-xl bg-card px-4 py-3 shadow-soft">
                    <span className="text-2xl font-bold text-foreground">{item.value}</span>
                  </div>
                  <span className="mt-1 text-xs text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Leaderboards Grid */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {leaderboards.map((board, boardIndex) => (
            <motion.div
              key={board.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: boardIndex * 0.1 }}
              className="rounded-2xl bg-card p-6 shadow-card"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`rounded-xl bg-gradient-to-br ${board.gradient} p-2.5`}>
                  <board.icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">{board.title}</h3>
              </div>

              <div className="space-y-3">
                {board.entries.map((entry, index) => (
                  <motion.div
                    key={entry.rank}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: boardIndex * 0.1 + index * 0.05 }}
                    className={`flex items-center gap-3 rounded-xl p-3 transition-all ${
                      entry.isCurrentUser ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                      entry.rank === 1 ? "bg-amber-400/20 text-amber-700" :
                      entry.rank === 2 ? "bg-slate-300/30 text-slate-600" :
                      entry.rank === 3 ? "bg-orange-300/20 text-orange-700" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {entry.rank}
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-accent text-lg">
                      {entry.avatar}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${entry.isCurrentUser ? "text-primary" : "text-foreground"}`}>
                        {entry.name}
                      </p>
                      {entry.badge && (
                        <span className="text-xs text-muted-foreground">{entry.badge}</span>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-foreground">{entry.score}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-card p-6 shadow-card"
        >
          <h3 className="font-serif text-lg font-semibold text-foreground mb-6">Your Badges</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`rounded-xl p-4 text-center transition-all ${
                  badge.earned 
                    ? "bg-gradient-to-br from-secondary/50 to-accent/30" 
                    : "bg-muted/30 opacity-50"
                }`}
              >
                <span className="text-3xl">{badge.icon}</span>
                <h4 className="mt-2 text-sm font-semibold text-foreground">{badge.name}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{badge.description}</p>
                {badge.earned && (
                  <span className="mt-2 inline-block rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                    Earned
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}