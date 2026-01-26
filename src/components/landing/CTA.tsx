import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary mb-8">
            <Sparkles className="h-4 w-4" />
            <span>Start Your Journey</span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to trade with
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              your full potential?
            </span>
          </h2>

          <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            Join thousands of women who are trading smarter, not harder.
            Start your free trial today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Start Free Trial → REGISTER */}
            <CTAButtons />
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const CTAButtons = () => {
  const navigate = useNavigate();

  const handleLearn = () => {
    const el = document.getElementById("features");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Button
        size="lg"
        className="w-full sm:w-auto text-lg px-8 py-6 rounded-full shadow-glow"
        onClick={() => navigate("/register")}
      >
        Start Free Trial
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>

      <Button
        variant="outline"
        size="lg"
        className="w-full sm:w-auto text-lg px-8 py-6 rounded-full"
        onClick={handleLearn}
      >
        Learn More
      </Button>
    </>
  );
};

export default CTA;
