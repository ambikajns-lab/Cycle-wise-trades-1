import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [timezone, setTimezone] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!mounted) return;
      if (user) {
        const metadata = user.user_metadata as {
          name?: string;
          phone?: string;
          avatar_url?: string;
          timezone?: string;
          experienceLevel?: string;
        } | undefined;
        setName(metadata?.name || "");
        setPhone(metadata?.phone || "");
        setAvatarUrl(metadata?.avatar_url || null);
        setEmail(user.email || "");
        setTimezone(metadata?.timezone || "");
        setExperienceLevel(metadata?.experienceLevel || "");
      }
    })();
    return () => { mounted = false; };
  }, []);

  // If no timezone set in profile, default to browser timezone
  useEffect(() => {
    if (timezone) return;
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) setTimezone(tz);
    } catch (e) {
      // ignore
    }
  }, [timezone]);

  const uploadAvatar = async (file: File) => {
    setLoading(true);
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error("Not authenticated");

      // Try to upload to 'avatars' bucket
      const filePath = `${userId}/avatar-${Date.now()}.png`;
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        // Fallback: read as data URL and save in metadata
        const reader = new FileReader();
        reader.onload = async () => {
          const dataUrl = String(reader.result);
          await supabase.auth.updateUser({ data: { avatar_url: dataUrl } });
          setAvatarUrl(dataUrl);
          toast({ title: "Avatar saved", description: "Profile picture updated." });
          setLoading(false);
        };
        reader.readAsDataURL(file);
        return;
      }

      // Get public URL
      const { data: publicData } = supabase.storage.from("avatars").getPublicUrl(uploadData.path);
      const publicUrl = (publicData as any)?.publicUrl;
      await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
      setAvatarUrl(publicUrl);
      toast({ title: "Avatar uploaded", description: "Profile picture updated." });
    } catch (err) {
      console.error(err);
      toast({ title: "Upload failed", description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const update: Record<string, unknown> = {
        email,
        data: { name, phone, timezone, experienceLevel },
      };
      if (password) (update as any).password = password;

      const { error } = await supabase.auth.updateUser(update as any);
      if (error) throw error;
      toast({ title: "Profile saved", description: "Your profile was updated." });
      setPassword("");
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      toast({ title: "Save failed", description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pb-24 pt-20 lg:pl-64 lg:pt-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-3xl p-4 lg:p-8">
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">Your Profile</h1>
          <p className="mt-1 text-muted-foreground">Manage your account details</p>
        </div>

        <Card className="rounded-2xl bg-card p-6 shadow-card">
          <CardHeader className="mb-4">
            <CardTitle className="text-lg">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="avatar" />
                ) : (
                  <AvatarFallback className="text-xl">U</AvatarFallback>
                )}
              </Avatar>

              <div className="flex flex-col">
                <label className="text-sm text-muted-foreground">Profile Photo</label>
                <div className="mt-3 flex items-center gap-3">
                  <input
                    id="avatar-input"
                    ref={(el) => (fileInputRef.current = el)}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && uploadAvatar(e.target.files[0])}
                  />

                  <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="px-4 py-2">
                    Choose file
                  </Button>

                  <span className="text-sm text-muted-foreground">PNG, JPG — max 2MB</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Display Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-foreground">Timezone</label>
                <Select value={timezone} onValueChange={(val) => setTimezone(val)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="(Select timezone)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC (UTC+0)</SelectItem>
                    <SelectItem value="Europe/Berlin">Europe/Berlin (UTC+1)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
                    <SelectItem value="America/New_York">America/New_York (UTC-5)</SelectItem>
                    <SelectItem value="America/Los_Angeles">America/Los_Angeles (UTC-8)</SelectItem>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</SelectItem>
                    <SelectItem value="Asia/Shanghai">Asia/Shanghai (UTC+8)</SelectItem>
                    <SelectItem value="Australia/Sydney">Australia/Sydney (UTC+10)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Experience Level</label>
                <Select value={experienceLevel} onValueChange={(val) => setExperienceLevel(val)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="(Select level)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="mt-2 flex items-center gap-3">
                <Button variant="outline" onClick={() => setShowChangePassword(true)}>Change password</Button>
                <p className="text-sm text-muted-foreground">Leave unchanged to keep current password.</p>
              </div>

              <Dialog open={showChangePassword} onOpenChange={(open) => setShowChangePassword(open)}>
                <DialogTrigger asChild>
                  <span />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change password</DialogTitle>
                    <DialogDescription>Enter your current password and choose a new one.</DialogDescription>
                  </DialogHeader>

                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="text-sm">Current password</label>
                      <Input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm">New password</label>
                      <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm">Confirm new password</label>
                      <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1" />
                    </div>
                  </div>

                  <DialogFooter>
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => setShowChangePassword(false)}>Cancel</Button>
                      <Button
                        onClick={async () => {
                          if (!email) {
                            toast({ title: "No email", description: "Email is required to re-authenticate." });
                            return;
                          }
                          if (!oldPassword || !newPassword || !confirmPassword) {
                            toast({ title: "Missing fields", description: "Please fill all password fields." });
                            return;
                          }
                          if (newPassword !== confirmPassword) {
                            toast({ title: "Mismatch", description: "New passwords do not match." });
                            return;
                          }
                          setLoading(true);
                          try {
                            // re-authenticate
                            const { error: signErr } = await supabase.auth.signInWithPassword({ email, password: oldPassword });
                            if (signErr) throw signErr;

                            // update password
                            const { error: updErr } = await supabase.auth.updateUser({ password: newPassword });
                            if (updErr) throw updErr;

                            toast({ title: "Password updated", description: "Your password was changed." });
                            setOldPassword("");
                            setNewPassword("");
                            setConfirmPassword("");
                            setShowChangePassword(false);
                          } catch (err) {
                            console.error("Password change failed:", err);
                            const msg = err instanceof Error ? err.message : String(err);
                            toast({ title: "Change failed", description: msg });
                          } finally {
                            setLoading(false);
                          }
                        }}
                      >
                        Change password
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex justify-end">
              <Button onClick={saveProfile} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
