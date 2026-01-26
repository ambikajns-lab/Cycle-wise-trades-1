import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function ProfileButton() {
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!mounted) return;
      setAvatarUrl((user?.user_metadata as any)?.avatar_url || null);
    })();
    return () => { mounted = false; };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <a href="/profile" className="rounded-full bg-pink-600 p-1.5 shadow-md">
          <Avatar>
            {avatarUrl ? <AvatarImage src={avatarUrl} alt="avatar" /> : <AvatarFallback>U</AvatarFallback>}
          </Avatar>
        </a>
      </div>
    </div>
  );
}
