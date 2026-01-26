import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RecentTradesTable } from "@/components/RecentTradesTable";
import { CyclePhaseIndicator } from "@/components/CyclePhaseIndicator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { Plus } from "lucide-react";

export default function Day() {
  const { day } = useParams<{ day: string }>();

  // Support both numeric day (e.g., '24') and ISO date (YYYY-MM-DD)
  const parseDate = (d?: string) => {
    if (!d) return new Date(2025, 0, 1);
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return new Date(d);
    const n = Number(d);
    return new Date(2025, 0, isNaN(n) ? 1 : n);
  };

  const dateObj = parseDate(day);
  const dayNum = dateObj.getDate();

  // Simple phase calculation matching CycleTracker logic (using day number)
  const phase = dayNum <= 5 ? "menstruation" : dayNum <= 12 ? "follicular" : dayNum <= 16 ? "ovulation" : "luteal";

  const isoDate = dateObj.toISOString().slice(0, 10);

  const [lastPeriodStart, setLastPeriodStart] = useState<string | null>(null);
  const [periodDays, setPeriodDays] = useState<string[]>([]);
  const [journalOpen, setJournalOpen] = useState(false);

  type TradeEntry = {
    id: string;
    instrument: string;
    direction: "long" | "short";
    rMultiple?: number | null;
    pnl?: number | null;
    strategy?: string;
  };

  type Journal = {
    quickNote: string;
    trades: TradeEntry[];
    mood: number;
    confidence: number;
    lessons: string;
    attachments?: string[];
  };

  const defaultJournal = (): Journal => ({ quickNote: "", trades: [], mood: 5, confidence: 5, lessons: "", attachments: [] });
  const [journal, setJournal] = useState<Journal>(defaultJournal());

  useEffect(() => {
    try {
      const l = localStorage.getItem('cw_lastPeriodStart');
      const pd = localStorage.getItem('cw_periodDays');
      if (l) setLastPeriodStart(l || null);
      if (pd) setPeriodDays(JSON.parse(pd));
    } catch (e) {
      // ignore
    }
  }, []);

  // load journal for this isoDate
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`cw_journal_${isoDate}`);
      if (raw) setJournal(JSON.parse(raw));
      else setJournal({ quickNote: "", trades: [], mood: 5, confidence: 5, lessons: "", attachments: [] });
    } catch (e) {
      setJournal({ quickNote: "", trades: [], mood: 5, confidence: 5, lessons: "", attachments: [] });
    }
  }, [isoDate]);

  const saveJournal = (next?: Partial<Journal>) => {
    const newJ = { ...journal, ...next };
    setJournal(newJ);
    try {
      localStorage.setItem(`cw_journal_${isoDate}`, JSON.stringify(newJ));
    } catch (e) {
      // ignore
    }
  };

  const save = () => {
    try {
      if (lastPeriodStart) localStorage.setItem('cw_lastPeriodStart', lastPeriodStart);
      localStorage.setItem('cw_periodDays', JSON.stringify(periodDays || []));
    } catch (e) {
      // ignore
    }
  };

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

              <div className="mt-4 flex items-center gap-2">
                <Button
                  onClick={() => {
                    if (periodDays.includes(isoDate)) {
                      setPeriodDays(periodDays.filter(d => d !== isoDate));
                    } else {
                      setPeriodDays([...periodDays, isoDate]);
                    }
                    save();
                  }}
                >
                  {periodDays.includes(isoDate) ? 'Unmark Period Day' : 'Mark Period Day'}
                </Button>
                <Button variant="outline" onClick={() => setJournalOpen(true)}>
                  Open Journal
                </Button>
              </div>

              <Dialog open={journalOpen} onOpenChange={setJournalOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Journal — {isoDate}</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 mt-2">
                    <div>
                      <label className="text-sm font-medium">Quick Note</label>
                      <Textarea value={journal.quickNote} onChange={(e) => saveJournal({ quickNote: e.target.value })} className="mt-2" />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Trades</label>
                      <div className="mt-2 space-y-2">
                        {journal.trades.map(t => (
                          <div key={t.id} className="flex items-center gap-2">
                            <div className="text-sm">{t.instrument} ({t.direction})</div>
                            <div className="text-xs text-muted-foreground">{t.strategy ?? ''}</div>
                          </div>
                        ))}

                        <TradeAdder onAdd={(t) => saveJournal({ trades: [...journal.trades, t] })} />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Mood</label>
                      <input type="range" min={0} max={10} value={journal.mood} onChange={(e) => saveJournal({ mood: Number(e.target.value) })} className="w-full mt-2" />
                      <div className="text-sm text-muted-foreground">{journal.mood}/10</div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Confidence</label>
                      <input type="range" min={0} max={10} value={journal.confidence} onChange={(e) => saveJournal({ confidence: Number(e.target.value) })} className="w-full mt-2" />
                      <div className="text-sm text-muted-foreground">{journal.confidence}/10</div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Lessons</label>
                      <Textarea value={journal.lessons} onChange={(e) => saveJournal({ lessons: e.target.value })} className="mt-2" />
                    </div>
                  </div>

                  <DialogFooter>
                    <div className="flex gap-2 justify-end">
                      <Button onClick={() => { setJournalOpen(false); }}>Close</Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

// Small helper component to add a trade entry
function TradeAdder({ onAdd }: { onAdd: (t: { id: string; instrument: string; direction: "long" | "short"; rMultiple?: number | null; pnl?: number | null; strategy?: string }) => void }) {
  const [instrument, setInstrument] = useState("");
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [strategy, setStrategy] = useState("");
  const [rMultiple, setRMultiple] = useState<number | undefined>(undefined);
  const [pnl, setPnl] = useState<number | undefined>(undefined);

  return (
    <div className="flex gap-2">
      <Input placeholder="Instrument" value={instrument} onChange={(e) => setInstrument(e.target.value)} />
      <select value={direction} onChange={(e) => setDirection(e.target.value as any)} className="rounded-md border px-2">
        <option value="long">Long</option>
        <option value="short">Short</option>
      </select>
      <Input placeholder="Strategy" value={strategy} onChange={(e) => setStrategy(e.target.value)} />
      <Input placeholder="R" type="number" value={rMultiple ?? ""} onChange={(e) => setRMultiple(e.target.value ? Number(e.target.value) : undefined)} className="w-20" />
      <Input placeholder="P&L" type="number" value={pnl ?? ""} onChange={(e) => setPnl(e.target.value ? Number(e.target.value) : undefined)} className="w-24" />
      <Button onClick={() => {
        if (!instrument) return;
        onAdd({ id: String(Date.now()) + Math.random().toString(36).slice(2,6), instrument, direction, rMultiple: rMultiple ?? null, pnl: pnl ?? null, strategy });
        setInstrument(""); setStrategy(""); setRMultiple(undefined); setPnl(undefined);
      }}>
        <Plus className="h-4 w-4 mr-1" /> Add
      </Button>
    </div>
  );
}
