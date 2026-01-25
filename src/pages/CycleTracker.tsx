import { motion } from "framer-motion";
import { Moon, Sun, Sparkles, Cloud, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const cyclePhases = [
  { name: "Menstruation", days: "1-5", icon: Moon, color: "bg-cycle-menstruation", description: "Rest & reflect. Focus on analysis, avoid heavy execution." },
  { name: "Follicular", days: "6-12", icon: Sun, color: "bg-cycle-follicular", description: "Energy rising! Great for learning, planning, backtesting." },
  { name: "Ovulation", days: "13-16", icon: Sparkles, color: "bg-cycle-ovulation", description: "Peak clarity. Best for high-confidence setups." },
  { name: "Luteal", days: "17-28", icon: Cloud, color: "bg-cycle-luteal", description: "Wind down. Reduce risk, consider Safety Mode." },
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Mock calendar data
const generateCalendarData = () => {
  const days = [];
  for (let i = 1; i <= 31; i++) {
    const phase = i <= 5 ? "menstruation" : i <= 12 ? "follicular" : i <= 16 ? "ovulation" : "luteal";
    days.push({
      day: i,
      phase,
      mood: Math.floor(Math.random() * 5) + 5,
      energy: Math.floor(Math.random() * 5) + 5,
      trades: i === 8 ? 2 : i === 15 ? 1 : i === 22 ? 3 : 0,
    });
  }
  return days;
};

export default function CycleTracker() {
  const [currentMonth] = useState("January 2025");
  const [selectedDay, setSelectedDay] = useState<number | null>(8);
  const calendarData = generateCalendarData();

  const getPhaseColor = (phase: string) => {
    const colors = {
      menstruation: "bg-cycle-menstruation/20 border-cycle-menstruation",
      follicular: "bg-cycle-follicular/20 border-cycle-follicular",
      ovulation: "bg-cycle-ovulation/20 border-cycle-ovulation",
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
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">Cycle Tracker</h1>
          <p className="mt-1 text-muted-foreground">Sync your trading with your natural rhythm</p>
        </div>

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
              <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="font-serif text-xl font-semibold text-foreground">{currentMonth}</h2>
              <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
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
              
              {calendarData.map((day) => (
                <motion.button
                  key={day.day}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDay(day.day)}
                  className={`relative aspect-square rounded-xl border-2 transition-all ${
                    getPhaseColor(day.phase)
                  } ${selectedDay === day.day ? "ring-2 ring-primary ring-offset-2" : ""}`}
                >
                  <span className="text-sm font-medium text-foreground">{day.day}</span>
                  {day.trades > 0 && (
                    <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary" />
                  )}
                </motion.button>
              ))}
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
                  January {selectedDay}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {calendarData[selectedDay - 1]?.phase.charAt(0).toUpperCase() + calendarData[selectedDay - 1]?.phase.slice(1)} Phase
                </p>

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
                  <span className="font-semibold text-foreground">Day 8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cycle Length</span>
                  <span className="font-semibold text-foreground">28 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Next Period</span>
                  <span className="font-semibold text-foreground">In 20 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Trades Logged</span>
                  <span className="font-semibold text-foreground">6 trades</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}