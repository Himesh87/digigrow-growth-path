import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, CalendarCheck, CheckCircle2, GraduationCap, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import {
  coursePercent,
  quizMax,
  quizTotal,
  useProfile,
  useProgress,
  useUpdateProgress,
} from "@/hooks/useProgress";
import { DAILY_TASKS, MODULES, type BusinessType } from "@/lib/digigrow-data";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — DigiGrow" },
      { name: "description", content: "Track your course, quiz and challenge progress on DigiGrow." },
      { property: "og:title", content: "Dashboard — DigiGrow" },
      { property: "og:description", content: "Your personalised digital marketing progress." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data: profile } = useProfile();
  const { data: progress } = useProgress();
  const updateProgress = useUpdateProgress();

  const type = (profile?.business_type ?? "other") as BusinessType;
  const percent = coursePercent(progress);
  const completed = progress?.completed_modules ?? [];
  const nextModule = MODULES.find((m) => !completed.includes(m.id)) ?? MODULES[0]!;
  const challengeDone = progress?.challenge_days.length ?? 0;
  const today = new Date().toISOString().slice(0, 10);
  const taskDone = progress?.task_done_on === today;

  function completeTask() {
    updateProgress.mutate(
      { task_done_on: today },
      {
        onSuccess: () => toast.success("Great job! Task marked as complete. ✅"),
        onError: () => toast.error("Could not save. Please try again."),
      },
    );
  }

  const stats = [
    {
      icon: GraduationCap,
      label: "Course Progress",
      value: `${percent}%`,
      hint: `${completed.length} of ${MODULES.length} modules`,
    },
    {
      icon: Trophy,
      label: "Quiz Score",
      value: `${quizTotal(progress)}/${quizMax}`,
      hint: "Best score across all quizzes",
    },
    {
      icon: CalendarCheck,
      label: "Challenge Progress",
      value: `${challengeDone}/7 Days`,
      hint: "7-Day Marketing Challenge",
    },
    {
      icon: BookOpen,
      label: "Recommended Lesson",
      value: nextModule.title,
      hint: "Pick up where you left off",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold md:text-4xl">
        Welcome back, {profile?.full_name || "Friend"}! 👋
      </h1>
      <p className="mt-2 text-muted-foreground">
        Here's how your digital marketing journey is going.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card
            key={s.label}
            className="rounded-3xl border-border/70 shadow-card transition-transform hover:-translate-y-1"
          >
            <CardContent className="p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <s.icon className="h-5 w-5" />
              </span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {s.label}
              </p>
              <p className="mt-1 text-xl font-extrabold">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6 rounded-3xl border-border/70 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Overall Course Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressBar value={percent} className="h-3" />
          <p className="mt-3 text-sm text-muted-foreground">
            {percent}% complete — {MODULES.length - completed.length} module(s) left.
          </p>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-border/70 bg-gradient-soft shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Today's Marketing Task</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base font-medium">{DAILY_TASKS[type]}</p>
            <Button
              className="mt-5 rounded-full bg-gradient-primary"
              onClick={completeTask}
              disabled={taskDone || updateProgress.isPending}
            >
              {taskDone ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Completed today
                </>
              ) : (
                "Mark as Complete"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/70 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Keep Going</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild variant="outline" className="justify-start rounded-2xl">
              <Link to="/learn">Continue learning: {nextModule.title}</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start rounded-2xl">
              <Link to="/my-business">See tips for my business</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start rounded-2xl">
              <Link to="/challenge">Continue 7-Day Challenge ({challengeDone}/7)</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
