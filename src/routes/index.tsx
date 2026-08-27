import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  BookOpen,
  Megaphone,
  Rocket,
  Store,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DigiGrow — Take Your Local Business Online" },
      {
        name: "description",
        content:
          "Learn simple digital marketing strategies, get tips for your business type and complete a 7-day challenge.",
      },
      { property: "og:title", content: "DigiGrow — Take Your Local Business Online" },
      {
        property: "og:description",
        content: "Beginner-friendly digital marketing training for small business owners.",
      },
    ],
  }),
  component: Home,
});

const FEATURES = [
  {
    icon: Users,
    title: "Get More Customers",
    text: "Learn how to reach potential customers online.",
  },
  {
    icon: Megaphone,
    title: "Promote Your Business",
    text: "Learn social media, WhatsApp and Google marketing.",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    text: "Use simple digital strategies to increase visibility and enquiries.",
  },
];

const STEPS = [
  { icon: UserPlus, title: "Create an account", text: "Sign up in less than a minute." },
  { icon: Store, title: "Select your business type", text: "We personalise your tips." },
  { icon: BookOpen, title: "Learn digital marketing", text: "5 short beginner modules." },
  { icon: BadgeCheck, title: "Complete challenges & quizzes", text: "Track your progress daily." },
];

function Home() {
  return (
    <div>
      <section className="bg-gradient-soft">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center md:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-muted-foreground shadow-card">
            <Rocket className="h-3.5 w-3.5 text-primary" /> Made for small business owners
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
            Take Your Local Business Online 🚀
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            Learn simple digital marketing strategies and grow your small business online.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="w-full rounded-full bg-gradient-primary shadow-lift transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              <Link to="/register">Start Learning</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full rounded-full sm:w-auto">
              <Link to="/learn">Explore Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <Card
              key={f.title}
              className="rounded-3xl border-border/70 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <CardContent className="p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <f.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-extrabold md:text-4xl">How DigiGrow Works</h2>
          <p className="mt-3 text-center text-muted-foreground">Four simple steps to get started.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Card key={s.title} className="rounded-3xl border-border/70 bg-card shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <s.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-bold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild size="lg" className="rounded-full bg-gradient-primary shadow-card">
              <Link to="/register">Create your free account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
