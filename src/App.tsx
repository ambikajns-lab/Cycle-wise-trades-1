import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import Dashboard from "./pages/Dashboard";
import TradeJournal from "./pages/TradeJournal";
import CycleTracker from "./pages/CycleTracker";
import Strategies from "./pages/Strategies";
import Challenges from "./pages/Challenges";
import AIInsights from "./pages/AIInsights";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navigation />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/journal" element={<TradeJournal />} />
            <Route path="/cycle" element={<CycleTracker />} />
            <Route path="/strategies" element={<Strategies />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/insights" element={<AIInsights />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;