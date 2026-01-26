import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Forex Trader",
    avatar: "S",
    content:
      "I never realized how much my cycle affected my trading until I started using CycleTrader. My win rate increased by 30% just by avoiding high-risk days.",
    rating: 5,
  },
  {
    name: "Jessica L.",
    role: "Prop Firm Trader",
    avatar: "J",
    content:
      "The Safety Mode saved me from so many revenge trades. I finally passed my funded challenge after failing 3 times before.",
    rating: 5,
  },
  {
    name: "Emma K.",
    role: "Crypto Trader",
    avatar: "E",
    content:
      "The AI insights are incredible. It found patterns in my losses I never would have noticed. Game changer for my discipline.",
    rating: 5,
  },
  {
    name: "Maria R.",
    role: "Index Trader",
    avatar: "M",
    content:
      "Finally, a trading journal that understands women. The cycle tracking combined with strategy analysis is pure gold.",
    rating: 5,
  },
  {
    name: "Anna T.",
    role: "Day Trader",
    avatar: "A",
    content:
      "I track my mood and energy daily, and the correlations with my P&L are eye-opening. This platform is revolutionary.",
    rating: 5,
  },
  {
    name: "Lisa H.",
    role: "Swing Trader",
    avatar: "L",
    content:
      "The prop firm tracker alone is worth it. I can finally see my true ROI across all my challenge attempts.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-secondary/30">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary mb-6"
          >
            <Star className="h-4 w-4 fill-primary" />
            <span>Loved by Traders</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-bold mb-4"
          >
            Join thousands of
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              empowered traders
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            See what our community is saying about CycleTrader
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 shadow-soft"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              <Quote className="h-8 w-8 text-primary/20 mb-2" />

              <p className="text-muted-foreground mb-6">{testimonial.content}</p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
