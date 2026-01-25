import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIInsightCardProps {
  insight: string;
  category: "pattern" | "recommendation" | "warning";
  actionLabel?: string;
  onAction?: () => void;
}

const categoryConfig = {
  pattern: {
    gradient: "from-secondary/50 to-accent/30",
    icon: "💡",
    label: "Pattern Detected",
  },
  recommendation: {
    gradient: "from-accent/50 to-secondary/30",
    icon: "✨",
    label: "AI Recommendation",
  },
  warning: {
    gradient: "from-amber-100/50 to-orange-100/30",
    icon: "⚠️",
    label: "Attention Needed",
  },
};

export function AIInsightCard({ insight, category, actionLabel, onAction }: AIInsightCardProps) {
  const config = categoryConfig[category];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${config.gradient} p-5`}
    >
      {/* Decorative sparkles */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -right-4 -top-4 h-24 w-24 opacity-20"
      >
        <Sparkles className="h-full w-full text-primary" />
      </motion.div>

      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="text-lg">{config.icon}</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {config.label}
          </span>
        </div>
        
        <p className="mt-3 text-base font-medium leading-relaxed text-foreground">
          {insight}
        </p>

        {actionLabel && onAction && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAction}
            className="mt-4 group"
          >
            {actionLabel}
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
