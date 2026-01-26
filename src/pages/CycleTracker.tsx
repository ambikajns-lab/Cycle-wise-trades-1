import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Shield, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { SafetyModeToggle } from "@/components/SafetyModeToggle";

type DayData = {
  day: number;
  date: Date;
  cycleDay: number;
  phase: "menstruation" | "follicular" | "ovulation" | "luteal";
  mood: number;
  energy: number;
  trades: number;
  pnl: number;
};

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const cyclePhases = [
  { name: "Menstruation", days: "1-5", color: "bg-red-100/40 border-red-300", description: "Bleeding and low energy.", icon: Info },
  { name: "Follicular", days: "6-12", color: "bg-yellow-100/40 border-yellow-300", description: "Rising energy and focus.", icon: Info },
  { name: "Ovulation", days: "13-16", color: "bg-green-100/40 border-green-300", description: "Peak energy and social drive.", icon: Info },
  { name: "Luteal", days: "17-28", color: "bg-indigo-100/30 border-indigo-300", description: "Pre-menstrual phase, possible irritability.", icon: Info },
];

// Calendar data generator using settings
const generateCalendarData = (year: number, monthIndex: number, avgCycleLength: number, lastPeriodStartIso: string, periodLength: number): DayData[] => {
  const days: DayData[] = [];
  const msPerDay = 1000 * 60 * 60 * 24;

  // parse last period start
  const lastStart = lastPeriodStartIso ? new Date(lastPeriodStartIso) : null;

  // number of days in month
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, monthIndex, i);

    // compute cycle day relative to last period start
    let cycleDay = 1;
    if (lastStart) {
      const diff = Math.floor((date.getTime() - lastStart.getTime()) / msPerDay);
      cycleDay = (((diff % avgCycleLength) + avgCycleLength) % avgCycleLength) + 1;
    }

    const follicularEnd = Math.min(periodLength + 7, avgCycleLength);
    const ovulationEnd = Math.min(periodLength + 11, avgCycleLength);
    const phase = cycleDay <= periodLength ? "menstruation" : cycleDay <= follicularEnd ? "follicular" : cycleDay <= ovulationEnd ? "ovulation" : "luteal";

    const trades = i === 8 ? 2 : i === 15 ? 1 : i === 22 ? 3 : 0;
    const pnl = trades > 0 ? Math.round((Math.random() - 0.3) * 800) : 0;

    days.push({
      day: i,
      date,
      phase,
      cycleDay,
      mood: Math.floor(Math.random() * 5) + 5,
      energy: Math.floor(Math.random() * 5) + 5,
      trades,
      pnl,
    });
  }
  return days;
};

export default function CycleTracker() {
  const [currentMonth] = useState("January 2025");
  const [selectedDay, setSelectedDay] = useState<number | null>(8);
  const navigate = useNavigate();
  const [safetyModeEnabled, setSafetyModeEnabled] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [avgCycleLength, setAvgCycleLength] = useState<number>(28);
  const [lastPeriodStart, setLastPeriodStart] = useState<string>("2025-01-17");
  const [pmsDays, setPmsDays] = useState<number>(3);
  const [variationDays, setVariationDays] = useState<number>(2);
  const [periodLength, setPeriodLength] = useState<number>(5);
  const [periodDays, setPeriodDays] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // load saved settings from localStorage on mount
  useEffect(() => {
    try {
      const a = localStorage.getItem('cw_avgCycleLength');
      const l = localStorage.getItem('cw_lastPeriodStart');
      const p = localStorage.getItem('cw_pmsDays');
      const v = localStorage.getItem('cw_variationDays');
      const per = localStorage.getItem('cw_periodLength');
    const pd = localStorage.getItem('cw_periodDays');
      if (a) setAvgCycleLength(Number(a));
      if (l) setLastPeriodStart(l);
      if (p) setPmsDays(Number(p));
      if (v) setVariationDays(Number(v));
      if (per) setPeriodLength(Number(per));
      if (pd) {
        try { setPeriodDays(JSON.parse(pd)); } catch { setPeriodDays([]); }
      }
    } catch (e) {
      // ignore storage errors
    }
  }, []);

  const saveSettings = () => {
    try {
      localStorage.setItem('cw_avgCycleLength', String(avgCycleLength));
      localStorage.setItem('cw_lastPeriodStart', lastPeriodStart);
      localStorage.setItem('cw_pmsDays', String(pmsDays));
      localStorage.setItem('cw_variationDays', String(variationDays));
      localStorage.setItem('cw_periodLength', String(periodLength));
      localStorage.setItem('cw_periodDays', JSON.stringify(periodDays));
    } catch (e) {
      // ignore
    }
  };

  // (no auto-save) — saving happens when user clicks Save Edits

  // displayed month (initially current month); navigation updates this
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const [displayedDate, setDisplayedDate] = useState<Date>(new Date());
  const calendarYear = displayedDate.getFullYear();
  const calendarMonthIndex = displayedDate.getMonth();
  const currentMonthLabel = `${monthNames[calendarMonthIndex]} ${calendarYear}`;

  // generate calendar with the (possibly) loaded settings (periodLength affects phases)
  const calendarData = generateCalendarData(calendarYear, calendarMonthIndex, avgCycleLength, lastPeriodStart, periodLength);

  // derived stats
  const msPerDay = 1000 * 60 * 60 * 24;
  const today = new Date();
  const currentCycleDay = lastPeriodStart ? (((Math.floor((today.getTime() - new Date(lastPeriodStart).getTime()) / msPerDay) % avgCycleLength) + avgCycleLength) % avgCycleLength) + 1 : null;
  const nextPeriodIn = currentCycleDay ? (avgCycleLength - currentCycleDay + 1) : null;
  const tradesLogged = calendarData.reduce((s, d) => s + (d.trades || 0), 0);

  const isSameDay = (a?: Date, b?: Date) => {
    if (!a || !b) return false;
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  };

  const selectedDayObj = selectedDay ? calendarData[selectedDay - 1] : null;

  const getPhaseColor = (phase: string) => {
    const colors = {
      menstruation: "bg-cycle-menstruation/20 border-cycle-menstruation",
      follicular: "bg-yellow-100/40 border-yellow-400",
      ovulation: "bg-green-100/40 border-green-400",
      luteal: "bg-cycle-luteal/20 border-cycle-luteal",
    };
    return colors[phase as keyof typeof colors];
  };

  return (
    <main className="pb-24 pt-20 lg:pl-64 lg:pt-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-7xl p-4 lg:p-8"
      >
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">Cycle Tracker</h1>
            <p className="mt-1 text-muted-foreground">Sync your trading with your natural rhythm</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              aria-label="Open safety mode"
              onClick={() => setSettingsOpen(true)}
              className={`rounded-xl p-2.5 shadow-soft hover:shadow ${safetyModeEnabled ? 'bg-destructive/10 text-destructive' : 'bg-card text-muted-foreground'}`}
            >
              <Shield className="h-5 w-5" />
            </button>
          </div>
        </div>

        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cycle Settings & Safety Mode</DialogTitle>
              <DialogDescription>Adjust your cycle parameters and Safety Mode preferences.</DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              <section className="rounded-2xl bg-card p-4">
                <div className="grid gap-4 grid-cols-2">
                  {/* Left column: Average + Variation stacked */}
                  <div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Average Cycle Length</label>
                      <div className="mt-1.5 flex items-center gap-2">
                          <Input
                            type="number"
                            min={18}
                            max={45}
                            value={avgCycleLength}
                            onChange={(e) => { setAvgCycleLength(Number(e.target.value || 0)); setIsDirty(true); }}
                            className="w-28"
                          />
                        <span className="text-sm text-muted-foreground">days</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="mt-1.5">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-foreground">Period Length</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 text-xs">
                                <Info className="h-3 w-3" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <p className="text-sm">Typical duration of your period in days.</p>
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <Input
                            type="number"
                            min={1}
                            max={14}
                            value={periodLength}
                            onChange={(e) => { setPeriodLength(Number(e.target.value || 0)); setIsDirty(true); }}
                            className="w-20"
                          />
                          <span className="text-sm text-muted-foreground">days</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right column: Last Period Start + PMS under it */}
                  <div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Last Period Start</label>
                      <Input
                        type="date"
                        value={lastPeriodStart}
                        onChange={(e) => { setLastPeriodStart(e.target.value); setIsDirty(true); }}
                        className="mt-1.5"
                      />
                    </div>

                      <div className="mt-4">
                        <div className="mt-1.5">
                            <div className="flex items-center gap-2">
                              <label className="text-sm font-medium text-foreground">PMS Days (before period)</label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 text-xs">
                                    <Info className="h-3 w-3" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent>
                                  <p className="text-sm">PMS days will be used to auto-enable Safety Mode before your period to reduce risk during sensitive days.</p>
                                </PopoverContent>
                              </Popover>
                            </div>

                            <div className="mt-2 flex items-center gap-2">
                              <Input
                                type="number"
                                min={0}
                                max={14}
                                value={pmsDays}
                                onChange={(e) => { setPmsDays(Number(e.target.value || 0)); setIsDirty(true); }}
                                className="w-20"
                              />
                              <span className="text-sm text-muted-foreground">days</span>
                            </div>
                          </div>
                    </div>
                  </div>
                </div>

                {/* Cycle variation centered under both columns */}
                <div className="mt-4 flex justify-center">
                  <div className="w-full max-w-md rounded-2xl bg-card p-4">
                    <div className="flex items-center gap-2 justify-center">
                      <label className="text-sm font-medium text-foreground">Cycle Variation</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 text-xs">
                            <Info className="h-3 w-3" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <p className="text-sm">Cycle variation is the typical fluctuation in your cycle length from month to month. Use this to set expected variability.</p>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="mt-2 flex items-center justify-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={14}
                        value={variationDays}
                        onChange={(e) => { setVariationDays(Number(e.target.value || 0)); setIsDirty(true); }}
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">days</span>
                    </div>
                  </div>
                </div>

              </section>

              <section className="rounded-2xl bg-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Auto-enable during PMS</p>
                    <p className="text-sm text-muted-foreground">Automatically protect yourself during sensitive days</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Auto-enable late Luteal</p>
                    <p className="text-sm text-muted-foreground">Days 24-28 of your cycle</p>
                  </div>
                  <Switch />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">30-min cooldown after losses</p>
                    <p className="text-sm text-muted-foreground">Prevent revenge trading</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </section>

              <section>
                <SafetyModeToggle enabled={safetyModeEnabled} onToggle={setSafetyModeEnabled} suggested={true} />
              </section>
            </div>

            <div className="mt-4 flex justify-end">
              {isDirty ? (
                <Button onClick={() => { saveSettings(); setIsDirty(false); setSettingsOpen(false); }}>Save Edits</Button>
              ) : (
                <Button onClick={() => setSettingsOpen(false)}>Done</Button>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Phase Legend */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cyclePhases.map((phase, index) => (
            <motion.div
              key={phase.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl bg-card p-4 shadow-card"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-xl ${phase.color} p-2.5`}>
                  <phase.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{phase.name}</h3>
                  <p className="text-xs text-muted-foreground">Days {phase.days}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{phase.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-card p-6 shadow-card lg:col-span-2"
          >
            <div className="mb-6 flex items-center justify-between">
              <button
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setDisplayedDate(new Date(calendarYear, calendarMonthIndex - 1, 1))}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="font-serif text-xl font-semibold text-foreground">{currentMonthLabel}</h2>
              <button
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setDisplayedDate(new Date(calendarYear, calendarMonthIndex + 1, 1))}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Week days header */}
            <div className="mb-4 grid grid-cols-7 gap-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for offset (assuming month starts on Wednesday) */}
              {[...Array(2)].map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              
              {calendarData.map((day) => {
                const isTodayCell = isSameDay(day.date, today);
                const dayIso = day.date.toISOString().slice(0,10);
                const isPeriodDay = periodDays.includes(dayIso);
                return (
                  <motion.button
                    key={day.day}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setSelectedDay(day.day); navigate(`/day/${day.date.toISOString().slice(0,10)}?journal=1`); }}
                    className={`relative aspect-square rounded-xl border-2 transition-all ${
                      getPhaseColor(day.phase)
                    } ${selectedDay === day.day ? "ring-2 ring-primary ring-offset-2" : ""} ${isTodayCell ? 'ring-4 ring-primary/30' : ''}`}
                  >
                    <span className="text-sm font-medium text-foreground">{day.day}</span>
                    {isTodayCell && (
                      <span className="absolute -top-2 -right-2 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">Today</span>
                    )}
                    {(pmsDays > 0 && day.cycleDay > avgCycleLength - pmsDays) && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute top-1 left-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                            !
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">PMS warning — {pmsDays} days before period</div>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {isPeriodDay && (
                      <div className="absolute bottom-1 left-1 rounded-md bg-red-100 px-1 text-xs text-red-700">Period</div>
                    )}
                    {day.trades > 0 && (
                      <>
                        <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary" />

                        <div className="absolute top-1 right-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className={`px-1.5 py-0.5 rounded-md text-xs font-medium ${day.pnl >= 0 ? 'bg-accent/70 text-accent-foreground' : 'bg-destructive/10 text-destructive'}`}>
                                {day.pnl >= 0 ? `+$${day.pnl}` : `-$${Math.abs(day.pnl)}`}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-sm">Trades: {day.trades}</div>
                              <div className="text-sm">Daily P&L: {day.pnl >= 0 ? `+$${day.pnl}` : `-$${Math.abs(day.pnl)}`}</div>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Day Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {selectedDay && (
              <div className="rounded-2xl bg-card p-6 shadow-card">
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  {monthNames[calendarMonthIndex]} {selectedDay}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {calendarData[selectedDay - 1]?.phase.charAt(0).toUpperCase() + calendarData[selectedDay - 1]?.phase.slice(1)} Phase
                </p>

                {selectedDayObj && (selectedDayObj.cycleDay > avgCycleLength - pmsDays) && (
                  <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3">
                    <div className="flex items-start gap-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-700 text-sm font-semibold">!</span>
                      <div>
                        <div className="font-semibold text-destructive">PMS Warning</div>
                        <div className="text-sm text-muted-foreground">This day is within your PMS window — consider enabling Safety Mode or reducing risk.</div>
                      </div>
                    </div>
                  </div>
                )}

                  {/* Actions for selected day: mark as period start, toggle period day */}
                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={() => {
                        const iso = calendarData[selectedDay - 1].date.toISOString().slice(0,10);
                        setLastPeriodStart(iso);
                        if (!periodDays.includes(iso)) setPeriodDays([...periodDays, iso]);
                        saveSettings();
                        setIsDirty(false);
                      }}
                    >
                      Set as Period Start
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        const iso = calendarData[selectedDay - 1].date.toISOString().slice(0,10);
                        if (periodDays.includes(iso)) {
                          setPeriodDays(periodDays.filter(d => d !== iso));
                        } else {
                          setPeriodDays([...periodDays, iso]);
                        }
                        saveSettings();
                        setIsDirty(false);
                      }}
                    >
                      {periodDays.includes(calendarData[selectedDay - 1].date.toISOString().slice(0,10)) ? 'Unmark Period Day' : 'Mark Period Day'}
                    </Button>

                    {/* Clear Period Start removed — setting a different start will recompute period */}
                  </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Mood</span>
                      <span className="font-medium text-foreground">{calendarData[selectedDay - 1]?.mood}/10</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-muted">
                      <div 
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${(calendarData[selectedDay - 1]?.mood || 0) * 10}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Energy</span>
                      <span className="font-medium text-foreground">{calendarData[selectedDay - 1]?.energy}/10</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-muted">
                      <div 
                        className="h-full rounded-full bg-accent transition-all"
                        style={{ width: `${(calendarData[selectedDay - 1]?.energy || 0) * 10}%` }}
                      />
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="mt-6 w-full">
                  <Plus className="h-4 w-4" />
                  Log Today's Data
                </Button>
              </div>
            )}

            {/* Quick Stats */}
            <div className="rounded-2xl bg-gradient-to-br from-secondary/50 to-accent/30 p-6">
              <h3 className="font-semibold text-foreground">This Cycle</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Day</span>
                  <span className="font-semibold text-foreground">{currentCycleDay ? `Day ${currentCycleDay}` : "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cycle Length</span>
                  <span className="font-semibold text-foreground">{avgCycleLength} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Next Period</span>
                  <span className="font-semibold text-foreground">{nextPeriodIn ? `In ${nextPeriodIn} days` : "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Trades Logged</span>
                  <span className="font-semibold text-foreground">{tradesLogged} trades</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}