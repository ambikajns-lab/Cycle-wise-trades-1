import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  Shield,
  TrendingUp,
  Target,
  BarChart3,
  Clock,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Smart Trade Journal",
    description:
      "Log trades with emotions, confirmations, and screenshots. Track every detail that matters.",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description:
      "Our AI analyzes your patterns and reveals what's really driving your wins and losses.",
    gradient: "from-cycle-ovulation/20 to-cycle-ovulation/5",
  },
  {
    icon: Shield,
    title: "Safety Mode",
    description:
      "Protect yourself during high-risk cycle phases. Block trading when you're most vulnerable.",
    gradient: "from-cycle-menstruation/20 to-cycle-menstruation/5",
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description:
      "50+ reports to visualize your progress, find weaknesses, and optimize your strategy.",
    gradient: "from-cycle-follicular/20 to-cycle-follicular/5",
  },
  {
    icon: Target,
    title: "Strategy Playbooks",
    description:
      "Define your rules, track confirmations, and see which strategies actually work for you.",
    gradient: "from-accent/20 to-accent/5",
  },
  {
    icon: BarChart3,
    title: "Prop Firm Tracker",
    description:
      "Track challenges, expenses, and payouts. See your true ROI across all prop firms.",
    gradient: "from-secondary/40 to-secondary/10",
  },
  {
    icon: Clock,
    title: "Cycle-Phase Analysis",
    description:
      "Discover how your performance changes throughout your cycle. Trade with your biology.",
    gradient: "from-cycle-luteal/20 to-cycle-luteal/5",
  },
  {
    icon: Sparkles,
    title: "Community Challenges",
    description:
      "Compete on leaderboards for profit, discipline, and cycle-aligned performance.",
    gradient: "from-primary/20 to-accent/5",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span>Everything You Need</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-bold mb-4"
          >
            Powerful features for
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              intentional trading
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Everything your spreadsheet can't tell you — and more.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <div className="h-full rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-card hover:border-primary/30">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
