import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Trophy, 
  Settings,
  TrendingUp,
  Sparkles,
  Menu,
  X
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/journal", icon: BookOpen, label: "Trade Journal" },
  { path: "/cycle", icon: Calendar, label: "Cycle Tracker" },
  { path: "/strategies", icon: TrendingUp, label: "Strategies" },
  { path: "/challenges", icon: Trophy, label: "Challenges" },
  { path: "/insights", icon: Sparkles, label: "AI Insights" },
];

export function Navigation() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-border bg-sidebar p-6 lg:flex"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70">
            <span className="text-lg font-bold text-primary-foreground">✨</span>
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-foreground">CycleTrader</h1>
            <p className="text-xs text-muted-foreground">For Women Who Trade</p>
          </div>
        </div>

        <div className="mt-10 flex flex-1 flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-0 h-full w-1 rounded-full bg-primary"
                  />
                )}
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </div>

        <NavLink
          to="/settings"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
          Settings
        </NavLink>
      </motion.nav>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-sidebar p-2 lg:hidden">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 rounded-xl p-2 transition-all ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label.split(" ")[0]}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b border-border bg-sidebar/95 backdrop-blur-sm p-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70">
            <span className="text-sm font-bold text-primary-foreground">✨</span>
          </div>
          <span className="font-serif text-base font-bold text-foreground">CycleTrader</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-foreground hover:bg-muted"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-30 bg-background/95 backdrop-blur-sm pt-16 lg:hidden"
        >
          <div className="flex flex-col gap-2 p-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-foreground hover:bg-muted"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}
