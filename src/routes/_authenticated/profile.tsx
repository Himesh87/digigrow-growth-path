import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { coursePercent, quizMax, quizTotal, useProfile, useProgress, useUpdateProfile } from "@/hooks/useProgress";
import { BUSINESS_TYPES, CHALLENGE_DAYS, type BusinessType } from "@/lib/digigrow-data";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — DigiGrow" },
      { name: "description", content: "Update your name, business details and marketing focus." },
      { property: "og:title", content: "My Profile — DigiGrow" },
      { property: "og:description", content: "Manage your DigiGrow account details." },
    ],
  }),
  component: ProfilePage,
});

const schema = z.object({
  full_name: z.string().trim().min(2, "Please enter your name").max(80),
  business_name: z.string().trim().max(80),
});

function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { data: progress } = useProgress();
  const updateProfile = useUpdateProfile();

  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>("other");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name ?? "");
    setBusinessName(profile.business_name ?? "");
    setBusinessType((profile.business_type ?? "other") as BusinessType);
  }, [profile]);

  function save(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ full_name: fullName, business_name: businessName });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setError(null);
    updateProfile.mutate(
      { ...parsed.data, business_type: businessType },
      {
        onSuccess: () => toast.success("Profile updated!"),
        onError: () => toast.error("Could not save your profile."),
      },
    );
  }

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-extrabold md:text-4xl">My Profile</h1>
      <p className="mt-2 text-muted-foreground">Keep your details up to date for better tips.</p>

      <Card className="mt-6 rounded-3xl border-border/70 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Account details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={save}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email ?? ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                value={fullName}
                maxLength={80}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business_name">Business name</Label>
              <Input
                id="business_name"
                value={businessName}
                maxLength={80}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business_type">Business type</Label>
              <Select
                value={businessType}
                onValueChange={(v) => setBusinessType(v as BusinessType)}
              >
                <SelectTrigger id="business_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPES.map((b) => (
                    <SelectItem key={b.value} value={b.value}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              className="w-full rounded-full bg-gradient-primary"
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6 rounded-3xl border-border/70 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Your achievements</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <Stat label="Course" value={`${coursePercent(progress)}%`} />
          <Stat label="Quiz score" value={`${quizTotal(progress)}/${quizMax}`} />
          <Stat
            label="Challenge"
            value={`${progress?.challenge_days.length ?? 0}/${CHALLENGE_DAYS.length}`}
          />
        </CardContent>
      </Card>

      <Button variant="outline" className="mt-6 rounded-full" onClick={handleSignOut}>
        <LogOut className="mr-2 h-4 w-4" /> Sign out
      </Button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted p-4 text-center">
      <p className="text-2xl font-extrabold text-gradient">{value}</p>
      <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
