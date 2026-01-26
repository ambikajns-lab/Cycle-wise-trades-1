import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const sendReset = async () => {
    if (!email) {
      toast({ title: "Missing email", description: "Please provide your account email." });
      return;
    }

    setLoading(true);
    try {
      // Supabase v2: use resetPasswordForEmail
      // Try both signatures for compatibility
      // @ts-ignore
      const res = await (supabase.auth as any).resetPasswordForEmail
        ? // @ts-ignore
          await (supabase.auth as any).resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/login`,
          })
        : // fallback to options style
          // @ts-ignore
          await (supabase.auth as any).resetPasswordForEmail({ email, options: { emailRedirectTo: `${window.location.origin}/login` } });

      // res may contain error depending on SDK; show generic success
      toast({ title: "Check your email", description: "If that account exists, we sent password reset instructions." });
      navigate("/login");
    } catch (err) {
      console.error("Reset request failed:", err);
      const msg = err instanceof Error ? err.message : String(err);
      toast({ title: "Reset failed", description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="shadow-card border border-border/50 backdrop-blur-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="font-serif text-3xl text-foreground">Reset Password</CardTitle>
            <p className="text-muted-foreground text-sm">Enter your email and we'll send reset instructions.</p>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-3">
              <Input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button onClick={sendReset} disabled={loading} className="w-full bg-primary text-primary-foreground py-5">
                {loading ? "Sending..." : "Send reset email"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
