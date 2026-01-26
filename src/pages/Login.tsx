import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-card border border-border/50 backdrop-blur-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="font-serif text-3xl text-foreground">
              Welcome Back ✨
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Log in to your SheTrades account
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
              {/* Email Login */}
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="flex justify-end">
                  <Link to="/reset-password" className="text-sm text-primary underline">
                    Forgot password?
                  </Link>
                </div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    try {
                      const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                      });
                      if (error) throw error;
                      toast({ title: "Logged in", description: "Welcome back!" });
                      navigate("/dashboard");
                    } catch (err: any) {
                      toast({ title: "Login failed", description: err.message || String(err) });
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-5">
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    or continue with
                  </span>
                </div>
              </div>

              {/* Social Login Buttons (UI only) */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-3 py-5"
                >
                  <FcGoogle className="text-xl" />
                  Continue with Google
                </Button>

                <Button
                  variant="outline"
                  className="w-full flex items-center gap-3 py-5"
                >
                  <FaApple className="text-xl" />
                  Continue with Apple
                </Button>

                <Button
                  variant="outline"
                  className="w-full flex items-center gap-3 py-5"
                  onClick={() => (window.location.href = "/auth/tradingview")}
                >
                  <TrendingUp className="text-xl" />
                  Continue with TradingView
                </Button>
              </div>

            <p className="text-center text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link to="/register" className="text-primary underline">
                Create one
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
