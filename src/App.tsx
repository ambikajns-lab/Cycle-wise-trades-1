import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import TradeJournal from "./pages/TradeJournal";
import CycleTracker from "./pages/CycleTracker";
import Day from "./pages/Day";
import Strategies from "./pages/Strategies";
import Challenges from "./pages/Challenges";
import AIInsights from "./pages/AIInsights";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// ⭐ NEU: Login & Register importieren
import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();

  // Navigation nur auf Landing ausblenden
  const isLandingPage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-background">
      {!isLandingPage && <Navigation />}

      {/* Top-right profile avatar is provided by the Dashboard page; removed global ProfileButton */}

      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* ⭐ Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Other Pages */}
        <Route path="/journal" element={<TradeJournal />} />
        <Route path="/cycle" element={<CycleTracker />} />
        <Route path="/day/:day" element={<Day />} />
        <Route path="/strategies" element={<Strategies />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/insights" element={<AIInsights />} />
        <Route path="/settings" element={<Settings />} />

        <Route path="/welcome" element={<Welcome />} />
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider attribute="class" defaultTheme="system">
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
