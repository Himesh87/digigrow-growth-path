import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProgress";
import {
  BUSINESS_TIPS,
  DAILY_TASKS,
  businessLabel,
  type BusinessType,
} from "@/lib/digigrow-data";

export const Route = createFileRoute("/_authenticated/my-business")({
  head: () => ({
    meta: [
      { title: "My Business — DigiGrow" },
      {
        name: "description",
        content: "Marketing strategies recommended for your specific type of small business.",
      },
      { property: "og:title", content: "My Business — DigiGrow" },
      { property: "og:description", content: "Personalised marketing tips for your business type." },
    ],
  }),
  component: MyBusinessPage,
});

function MyBusinessPage() {
  const { data: profile } = useProfile();
  const type = (profile?.business_type ?? "other") as BusinessType;
  const tips = BUSINESS_TIPS[type];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold md:text-4xl">Marketing Tips For Your Business</h1>
      <p className="mt-2 text-muted-foreground">
        These recommendations are chosen for your business type.
      </p>

      <Card className="mt-6 rounded-3xl border-border/70 bg-gradient-soft shadow-card">
        <CardContent className="flex flex-wrap items-center gap-4 p-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-primary shadow-card">
            <Store className="h-6 w-6" />
          </span>
          <div>
            <p className="text-lg font-bold">{profile?.business_name || "Your business"}</p>
            <p className="text-sm text-muted-foreground">Business type: {businessLabel(type)}</p>
          </div>
          <Button asChild variant="outline" className="ml-auto rounded-full">
            <Link to="/profile">Change business type</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6 rounded-3xl border-border/70 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" /> Recommended strategies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {tips.map((tip, i) => (
              <li
                key={tip}
                className="flex items-start gap-3 rounded-2xl border border-border p-4 transition-colors hover:bg-accent/60"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="text-sm font-medium">{tip}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card className="mt-6 rounded-3xl border-border/70 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Start with this today</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{DAILY_TASKS[type]}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="rounded-full bg-gradient-primary">
              <Link to="/learn">Learn how to do it</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/challenge">Join the 7-Day Challenge</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
