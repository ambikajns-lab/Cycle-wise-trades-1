import { Moon, Sun, Sparkles, Cloud, TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type CyclePhase = "menstrual" | "follicular" | "ovulatory" | "luteal";

interface PhaseInfo {
  name: string;
  days: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  tradingAdvice: string;
  riskLevel: "low" | "moderate" | "high";
  focus: string[];
}

export const phaseData: Record<CyclePhase, PhaseInfo> = {
  menstrual: {
    name: "Menstrual Phase",
    days: "Days 1-5",
    icon: Moon,
    color: "text-cycle-menstruation",
    bgColor: "bg-cycle-menstruation/10",
    tradingAdvice: "Focus on analysis over execution. Your energy is low - perfect for reviewing past trades.",
    riskLevel: "low",
    focus: ["Review trades", "Journal", "Rest"],
  },
  follicular: {
    name: "Follicular Phase",
    days: "Days 6-14",
    icon: Sun,
    color: "text-cycle-follicular",
    bgColor: "bg-cycle-follicular/10",
    tradingAdvice: "Rising energy and creativity. Great time for learning new strategies and backtesting.",
    riskLevel: "moderate",
    focus: ["Learn", "Backtest", "Plan"],
  },
  ovulatory: {
    name: "Ovulatory Phase",
    days: "Days 15-17",
    icon: Sparkles,
    color: "text-cycle-ovulation",
    bgColor: "bg-cycle-ovulation/10",
    tradingAdvice: "Peak clarity and confidence. Execute your highest-conviction setups.",
    riskLevel: "high",
    focus: ["Execute", "Scale up", "Network"],
  },
  luteal: {
    name: "Luteal Phase",
    days: "Days 18-28",
    icon: Cloud,
    color: "text-cycle-luteal",
    bgColor: "bg-cycle-luteal/10",
    tradingAdvice: "Heightened emotional sensitivity. Reduce position sizes and consider Safety Mode.",
    riskLevel: "low",
    focus: ["Reduce risk", "Automate", "Self-care"],
  },
};

interface CyclePhaseCardProps {
  phase: CyclePhase;
  isActive?: boolean;
  compact?: boolean;
}

const CyclePhaseCard = ({ phase, isActive = false, compact = false }: CyclePhaseCardProps) => {
  const info = phaseData[phase];
  const Icon = info.icon;

  const RiskIcon = info.riskLevel === "high" ? TrendingUp : info.riskLevel === "low" ? TrendingDown : Minus;

  if (compact) {
    return (
      <div
        className={cn(
          "rounded-xl border p-4 transition-all duration-300",
          isActive
            ? `${info.bgColor} border-current ${info.color}`
            : "border-border/50 bg-card/50 hover:bg-card"
        )}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className={cn("p-2 rounded-lg", info.bgColor)}>
            <Icon className={cn("h-4 w-4", info.color)} />
          </div>
          <div>
            <p className="font-semibold text-sm">{info.name.split(" ")[0]}</p>
            <p className="text-xs text-muted-foreground">{info.days}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {info.focus.map((item) => (
            <span
              key={item}
              className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border p-6 transition-all duration-300",
        info.bgColor,
        `border-current ${info.color}`
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-3 rounded-xl", info.color, "bg-current/10")}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{info.name}</h3>
            <p className="text-sm text-muted-foreground">{info.days}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <RiskIcon className="h-3.5 w-3.5" />
          <span className="capitalize">{info.riskLevel} risk</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{info.tradingAdvice}</p>

      <div className="flex flex-wrap gap-2">
        {info.focus.map((item) => (
          <span
            key={item}
            className={cn(
              "text-xs font-medium px-3 py-1 rounded-full",
              "bg-background/50 text-foreground"
            )}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CyclePhaseCard;
