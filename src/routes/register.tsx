import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { BUSINESS_TYPES } from "@/lib/digigrow-data";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Account — DigiGrow" },
      {
        name: "description",
        content: "Sign up for DigiGrow and get marketing tips made for your business type.",
      },
      { property: "og:title", content: "Create Account — DigiGrow" },
      {
        property: "og:description",
        content: "Join DigiGrow and start learning digital marketing today.",
      },
    ],
  }),
  component: RegisterPage,
});

const schema = z
  .object({
    fullName: z.string().trim().min(2, "Please enter your full name").max(100),
    email: z.string().trim().email("Enter a valid email address").max(255),
    password: z.string().min(6, "Password must be at least 6 characters").max(72),
    confirmPassword: z.string(),
    businessName: z.string().trim().min(2, "Please enter your business name").max(100),
    businessType: z.string().min(1, "Please select your business type"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function RegisterPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    businessType: "",
  });

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setErrors({});
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: parsed.data.fullName,
          business_name: parsed.data.businessName,
          business_type: parsed.data.businessType,
        },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message || "Could not create your account.");
      return;
    }
    if (!data.session) {
      toast.success("Account created! Please check your email to confirm and then log in.");
      navigate({ to: "/auth" });
      return;
    }
    toast.success("Welcome to DigiGrow! 🎉");
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <Card className="rounded-3xl border-border/70 shadow-lift">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-extrabold">Create your DigiGrow account</CardTitle>
          <CardDescription>Tell us about your business so we can personalise your tips.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <Field label="Full Name" error={errors["fullName"]}>
              <Input
                value={form.fullName}
                onChange={(e) => set("fullName")(e.target.value)}
                placeholder="Ravi Kumar"
                maxLength={100}
              />
            </Field>
            <Field label="Email" error={errors["email"]}>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set("email")(e.target.value)}
                placeholder="you@example.com"
                maxLength={255}
              />
            </Field>
            <Field label="Password" error={errors["password"]}>
              <div className="relative">
                <Input
                  type={show ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password")(e.target.value)}
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  aria-label={show ? "Hide password" : "Show password"}
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
            <Field label="Confirm Password" error={errors["confirmPassword"]}>
              <Input
                type={show ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) => set("confirmPassword")(e.target.value)}
                placeholder="Re-enter password"
              />
            </Field>
            <Field label="Business Name" error={errors["businessName"]}>
              <Input
                value={form.businessName}
                onChange={(e) => set("businessName")(e.target.value)}
                placeholder="Ravi Fashion Store"
                maxLength={100}
              />
            </Field>
            <Field label="Business Type" error={errors["businessType"]}>
              <Select value={form.businessType} onValueChange={set("businessType")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your business type" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPES.map((b) => (
                    <SelectItem key={b.value} value={b.value}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Button type="submit" className="w-full rounded-full bg-gradient-primary" disabled={busy}>
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth" className="font-semibold text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
