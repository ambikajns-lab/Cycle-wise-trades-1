import { motion } from "framer-motion";
import { Wallet, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";

interface PropFirmSummaryProps {
  totalExpenses: number;
  totalPayouts: number;
  netProfit: number;
  roi: number;
}

export function PropFirmSummary({ totalExpenses, totalPayouts, netProfit, roi }: PropFirmSummaryProps) {
  const isProfit = netProfit >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-secondary/50 to-accent/30 p-5"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-card p-2.5">
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground">Prop Firm Summary</h3>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowDownRight className="h-3 w-3" />
            Expenses
          </div>
          <p className="text-lg font-semibold text-foreground">${totalExpenses.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowUpRight className="h-3 w-3" />
            Payouts
          </div>
          <p className="text-lg font-semibold text-foreground">${totalPayouts.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-card/60 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Net Profit</p>
            <p className={`text-2xl font-bold ${isProfit ? "text-accent-foreground" : "text-destructive"}`}>
              {isProfit ? "+" : "-"}${Math.abs(netProfit).toLocaleString()}
            </p>
          </div>
          <div className={`flex items-center gap-1 rounded-lg px-3 py-1.5 ${
            isProfit ? "bg-accent/50 text-accent-foreground" : "bg-destructive/10 text-destructive"
          }`}>
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-semibold">{roi}% ROI</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}