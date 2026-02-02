import { motion } from "framer-motion";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface QuickTradeEntryProps {
  onNewTrade: (trade: {
    instrument: string;
    direction: "long" | "short";
    rMultiple?: number | null;
    pnl?: number | null;
    strategy?: string;
  }) => void;
  safetyModeEnabled: boolean;
}

export function QuickTradeEntry({ onNewTrade, safetyModeEnabled }: QuickTradeEntryProps) {
  const [direction, setDirection] = useState<"long" | "short" | null>(null);

  if (safetyModeEnabled) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden rounded-2xl bg-muted/50 p-8 text-center"
      >
        <div className="absolute inset-0 backdrop-blur-sm" />
        <div className="relative">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-3xl">🛡️</span>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">Safety Mode Active</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Trade entry is blocked during this phase. Focus on analysis and planning.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card p-6 shadow-card"
    >
      <h3 className="text-lg font-serif font-semibold text-foreground">Quick Trade Entry</h3>
      <p className="mt-1 text-sm text-muted-foreground">Log a new trade with your strategy</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setDirection("long")}
          className={`flex flex-col items-center gap-2 rounded-xl p-4 transition-all ${
            direction === "long"
              ? "bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-700"
              : "bg-muted hover:bg-muted/80 text-foreground"
          }`}
        >
          <TrendingUp className="h-6 w-6" />
          <span className="text-sm font-medium">Long</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setDirection("short")}
          className={`flex flex-col items-center gap-2 rounded-xl p-4 transition-all ${
            direction === "short"
              ? "bg-red-500/20 border-2 border-red-500/50 text-red-700"
              : "bg-muted hover:bg-muted/80 text-foreground"
          }`}
        >
          <TrendingDown className="h-6 w-6" />
          <span className="text-sm font-medium">Short</span>
        </motion.button>
      </div>

      <Button
        onClick={() => {
          if (!direction) return;
          onNewTrade({ instrument: "Unknown", direction, rMultiple: null, pnl: null, strategy: "" });
        }}
        variant="hero"
        size="lg"
        className="mt-5 w-full"
        disabled={!direction}
      >
        <Plus className="h-5 w-5" />
        Log Trade
      </Button>
    </motion.div>
  );
}
