import { motion } from "framer-motion";
import { Trophy, Crown, Medal, Award } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  badge?: string;
}

interface LeaderboardPreviewProps {
  entries: LeaderboardEntry[];
  type: "profit" | "discipline" | "risk" | "cycle";
  currentUserRank?: number;
}

const typeConfig = {
  profit: { icon: Trophy, label: "Profit Leaders", gradient: "from-amber-400/20 to-yellow-300/20" },
  discipline: { icon: Award, label: "Strategy Discipline", gradient: "from-secondary to-accent/30" },
  risk: { icon: Medal, label: "Risk Masters", gradient: "from-accent to-secondary/30" },
  cycle: { icon: Crown, label: "Cycle Aligned", gradient: "from-primary/20 to-secondary" },
};

export function LeaderboardPreview({ entries, type, currentUserRank }: LeaderboardPreviewProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card p-5 shadow-card"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`rounded-xl bg-gradient-to-br ${config.gradient} p-2.5`}>
            <Icon className="h-5 w-5 text-foreground" />
          </div>
          <h3 className="font-semibold text-foreground">{config.label}</h3>
        </div>
        {currentUserRank && (
          <span className="text-sm text-muted-foreground">Your rank: #{currentUserRank}</span>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {entries.slice(0, 3).map((entry, index) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
              entry.rank === 1 ? "bg-amber-400/20 text-amber-700" :
              entry.rank === 2 ? "bg-slate-300/30 text-slate-600" :
              "bg-orange-300/20 text-orange-700"
            }`}>
              {entry.rank}
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-accent text-sm">
              {entry.avatar}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{entry.name}</p>
              {entry.badge && (
                <span className="text-xs text-muted-foreground">{entry.badge}</span>
              )}
            </div>
            <span className="text-sm font-semibold text-foreground">{entry.score}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
