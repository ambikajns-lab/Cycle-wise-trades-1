import { useLocation, Link } from "react-router-dom";

const Welcome = () => {
  const location = useLocation();
  // name may be passed via navigation state
  // fallback to generic greeting
  const name = (location.state as any)?.name || null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero p-6">
      <div className="w-full max-w-2xl text-center">
        <h1 className="font-serif text-4xl mb-4">Welcome{name ? `, ${name}` : ""} 🎉</h1>
        <p className="text-muted-foreground mb-6">
          Thanks for signing up. Please check your email for a confirmation link to activate your account.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link to="/login" className="px-6 py-3 rounded-full bg-primary text-primary-foreground">
            Go to Login
          </Link>
          <Link to="/" className="px-6 py-3 rounded-full border border-border">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
