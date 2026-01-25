import { motion } from "framer-motion";
import { User, Bell, Shield, Download, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
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

        {/* Profile Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl bg-card p-6 shadow-card"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-primary/10 p-2.5">
              <User className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-semibold text-foreground">Profile</h2>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-3xl text-primary-foreground">
              ✨
            </div>
            <div className="flex-1">
              <Button variant="outline" size="sm">Change Photo</Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Display Name</label>
              <Input defaultValue="Trader Queen" className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input defaultValue="trader@example.com" type="email" className="mt-1.5" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-foreground">Timezone</label>
                <Input defaultValue="UTC-5 (Eastern)" className="mt-1.5" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Experience Level</label>
                <Input defaultValue="Intermediate" className="mt-1.5" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Cycle Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 rounded-2xl bg-card p-6 shadow-card"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-cycle-follicular/30 p-2.5">
              <Calendar className="h-5 w-5 text-cycle-follicular" />
            </div>
            <h2 className="font-semibold text-foreground">Cycle Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-foreground">Average Cycle Length</label>
                <Input defaultValue="28 days" className="mt-1.5" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Last Period Start</label>
                <Input defaultValue="January 17, 2025" type="text" className="mt-1.5" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">PMS Days (before period)</label>
              <Input defaultValue="3 days" className="mt-1.5" />
            </div>
          </div>
        </motion.section>

        {/* Safety Mode Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 rounded-2xl bg-card p-6 shadow-card"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-primary/10 p-2.5">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-semibold text-foreground">Safety Mode</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Auto-enable during PMS</p>
                <p className="text-sm text-muted-foreground">Automatically protect yourself during sensitive days</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Auto-enable late Luteal</p>
                <p className="text-sm text-muted-foreground">Days 24-28 of your cycle</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">30-min cooldown after losses</p>
                <p className="text-sm text-muted-foreground">Prevent revenge trading</p>
              </div>
              <Switch defaultChecked />
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