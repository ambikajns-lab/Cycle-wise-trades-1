import { motion } from "framer-motion";
import { User, Bell, Shield, Download, Trash2, Calendar, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === "dark" : false;

  const toggleTheme = (val: boolean) => {
    setTheme(val ? "dark" : "light");
  };

  return (
    <main className="pb-24 pt-20 lg:pl-64 lg:pt-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-3xl p-4 lg:p-8"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">Settings</h1>
          <p className="mt-1 text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Profile moved to dedicated Profile page (top-right avatar) */}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 rounded-2xl bg-card p-6 shadow-card"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-cycle-follicular/30 p-2.5">
              <Calendar className="h-5 w-5 text-cycle-follicular" />
            </div>
            <h2 className="font-semibold text-foreground">Cycle Settings & Safety Mode</h2>
          </div>
          <p className="text-sm text-muted-foreground">These controls moved to the Cycle Tracker for quicker access while trading.</p>
          <div className="mt-4">
            <Link to="/cycle-tracker">
              <Button variant="outline">Open Cycle Tracker</Button>
            </Link>
          </div>
        </motion.section>

        {/* Theme */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 rounded-2xl bg-card p-6 shadow-card"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-muted p-2.5">
              <Sun className="h-5 w-5 text-foreground" />
            </div>
            <h2 className="font-semibold text-foreground">Theme</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Appearance</p>
              <p className="text-sm text-muted-foreground">Choose between Light and Dark modes</p>
            </div>
            <div className="flex items-center gap-3">
              <Moon className="h-4 w-4 text-muted-foreground" />
              <Switch checked={isDark} onCheckedChange={(v) => toggleTheme(Boolean(v))} />
              <Sun className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </motion.section>

        {/* Notifications */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 rounded-2xl bg-card p-6 shadow-card"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-accent/50 p-2.5">
              <Bell className="h-5 w-5 text-accent-foreground" />
            </div>
            <h2 className="font-semibold text-foreground">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Daily trading reminders</p>
                <p className="text-sm text-muted-foreground">Get notified about optimal trading windows</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Cycle phase alerts</p>
                <p className="text-sm text-muted-foreground">Know when you enter a new phase</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Challenge updates</p>
                <p className="text-sm text-muted-foreground">Leaderboard changes and achievements</p>
              </div>
              <Switch />
            </div>
          </div>
        </motion.section>

        {/* Data & Privacy */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-card p-6 shadow-card"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-muted p-2.5">
              <Download className="h-5 w-5 text-muted-foreground" />
            </div>
            <h2 className="font-semibold text-foreground">Data & Privacy</h2>
          </div>

          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export All Data (CSV)
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Generate Monthly Report (PDF)
            </Button>
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
}