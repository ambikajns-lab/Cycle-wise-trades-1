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
import NewTrade from "./pages/NewTrade";
import Strategies from "./pages/Strategies";
import StrategyList from "./pages/strategies/StrategyList";
import StrategyEdit from "./pages/strategies/StrategyEdit";
import Challenges from "./pages/Challenges";
import AIInsights from "./pages/AIInsights";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Statistics from "./pages/Statistics";
import PropFirmAccounts from "./pages/PropFirmAccounts";
import PropFirmCompare from "./pages/PropFirmCompare";

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

        {/* Dashboard (Protected) */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* Other Pages (Protected) */}
        <Route path="/journal" element={<ProtectedRoute><TradeJournal /></ProtectedRoute>} />
        <Route path="/trade/new" element={<ProtectedRoute><NewTrade /></ProtectedRoute>} />
        <Route path="/cycle" element={<ProtectedRoute><CycleTracker /></ProtectedRoute>} />
        <Route path="/day/:day" element={<ProtectedRoute><Day /></ProtectedRoute>} />
        <Route path="/strategies" element={<ProtectedRoute><Strategies /></ProtectedRoute>} />
        <Route path="/strategies/list" element={<ProtectedRoute><StrategyList /></ProtectedRoute>} />
        <Route path="/strategies/new" element={<ProtectedRoute><StrategyEdit /></ProtectedRoute>} />
        <Route path="/strategies/edit/:name" element={<ProtectedRoute><StrategyEdit /></ProtectedRoute>} />
        <Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
        <Route path="/insights" element={<ProtectedRoute><AIInsights /></ProtectedRoute>} />
        <Route path="/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
        <Route path="/prop-firms" element={<ProtectedRoute><PropFirmAccounts /></ProtectedRoute>} />
        <Route path="/propfirm-compare" element={<ProtectedRoute><PropFirmCompare /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

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
