import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { RecentTradesTable } from "@/components/RecentTradesTable";
import { CyclePhaseIndicator } from "@/components/CyclePhaseIndicator";

export default function Day() {
  const { day } = useParams<{ day: string }>();
  const dayNum = Number(day || 1);

  // Simple phase calculation matching CycleTracker logic
  const phase = dayNum <= 5 ? "menstruation" : dayNum <= 12 ? "follicular" : dayNum <= 16 ? "ovulation" : "luteal";

  // Mock trades (small sample); in future replace with real data
  const mockTrades = [
    { id: "1", date: "Jan 24", instrument: "EUR/USD", direction: "long" as const, result: "win" as const, rMultiple: 2.1, strategy: "ICT", cyclePhase: "Follicular" },
    { id: "2", date: "Jan 23", instrument: "GBP/JPY", direction: "short" as const, result: "loss" as const, rMultiple: -1, strategy: "SMC", cyclePhase: "Follicular" },
    { id: "3", date: "Jan 22", instrument: "NAS100", direction: "long" as const, result: "win" as const, rMultiple: 1.5, strategy: "ICT", cyclePhase: "Ovulation" },
    { id: "4", date: "Jan 21", instrument: "XAU/USD", direction: "short" as const, result: "breakeven" as const, rMultiple: 0, strategy: "SMC", cyclePhase: "Ovulation" },
  ];

  const dayLabel = `January ${dayNum}`;
  const filtered = mockTrades.filter(t => t.date.endsWith(String(dayNum)));

  return (
    <main className="pb-24 pt-20 lg:pl-64 lg:pt-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-4xl p-4 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">{dayLabel}</h1>
            <p className="mt-1 text-muted-foreground">Trades and notes for {dayLabel} — phase: {phase}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/cycle" className="text-sm text-primary underline">Back to Cycle Tracker</Link>
            <Link to={`/journal?date=2025-01-${String(dayNum).padStart(2, "0")}`} className="text-sm text-primary underline">Open in Journal</Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {filtered.length > 0 ? (
              <RecentTradesTable trades={filtered} />
            ) : (
              <div className="rounded-2xl bg-card p-6 text-center">
                <p className="text-muted-foreground">No trades logged for this day.</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <CyclePhaseIndicator
              phase={phase}
              day={dayNum}
              recommendation={phase === "luteal" ? "Consider enabling Safety Mode on this day." : ""}
            />

            <div className="rounded-2xl bg-card p-6">
              <h3 className="font-semibold text-foreground">Quick Actions</h3>
              <p className="mt-2 text-sm text-muted-foreground">Log a trade or add a note for {dayLabel}.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
