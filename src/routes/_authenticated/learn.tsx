import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { QuizDialog } from "@/components/QuizDialog";
import { coursePercent, useProgress, useUpdateProgress } from "@/hooks/useProgress";
import { MODULES, type Module } from "@/lib/digigrow-data";

export const Route = createFileRoute("/_authenticated/learn")({
  head: () => ({
    meta: [
      { title: "Learn Digital Marketing — DigiGrow" },
      {
        name: "description",
        content: "Five beginner modules: social media, WhatsApp, Google Business, content and ads.",
      },
      { property: "og:title", content: "Learn Digital Marketing — DigiGrow" },
      { property: "og:description", content: "Short, beginner-friendly marketing lessons." },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  const { data: progress } = useProgress();
  const updateProgress = useUpdateProgress();
  const [quizModule, setQuizModule] = useState<Module | null>(null);
  const [open, setOpen] = useState(false);

  const completed = progress?.completed_modules ?? [];

  function toggleComplete(id: string) {
    const next = completed.includes(id) ? completed.filter((m) => m !== id) : [...completed, id];
    updateProgress.mutate(
      { completed_modules: next },
      {
        onSuccess: () =>
          toast.success(completed.includes(id) ? "Marked as not complete." : "Module completed! ✅"),
        onError: () => toast.error("Could not save your progress."),
      },
    );
  }

  function saveScore(moduleId: string, score: number) {
    const scores = { ...(progress?.quiz_scores ?? {}) };
    const best = Math.max(scores[moduleId] ?? 0, score);
    scores[moduleId] = best;
    updateProgress.mutate(
      { quiz_scores: scores },
      {
        onSuccess: () => toast.success(`Quiz saved — your best score is ${best}/5.`),
        onError: () => toast.error("Could not save your quiz score."),
      },
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold md:text-4xl">Learn Digital Marketing</h1>
      <p className="mt-2 text-muted-foreground">
        Five short modules written for business owners, not marketers.
      </p>

      <div className="mt-6 rounded-3xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>Your progress</span>
          <span>{coursePercent(progress)}%</span>
        </div>
        <ProgressBar value={coursePercent(progress)} className="mt-3 h-3" />
      </div>

      <div className="mt-8 space-y-6">
        {MODULES.map((m, i) => {
          const isDone = completed.includes(m.id);
          const score = progress?.quiz_scores?.[m.id];
          return (
            <Card key={m.id} className="rounded-3xl border-border/70 shadow-card">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <CardTitle className="text-xl">{m.title}</CardTitle>
                  {isDone && (
                    <Badge className="rounded-full bg-success text-success-foreground">
                      Completed
                    </Badge>
                  )}
                  {score !== undefined && (
                    <Badge variant="secondary" className="rounded-full">
                      Quiz: {score}/5
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{m.summary}</p>

                <div className="flex flex-wrap gap-2">
                  {m.topics.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="rounded-2xl bg-muted p-4 text-sm">
                  <p className="font-semibold">Example</p>
                  <p className="mt-1 text-muted-foreground">{m.example}</p>
                </div>

                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <Lightbulb className="h-4 w-4 text-primary" /> Tips
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {m.tips.map((tip) => (
                      <li key={tip} className="flex gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Button
                    variant={isDone ? "outline" : "default"}
                    className={`rounded-full ${isDone ? "" : "bg-gradient-primary"}`}
                    onClick={() => toggleComplete(m.id)}
                    disabled={updateProgress.isPending}
                  >
                    {isDone ? "Mark as Not Complete" : "Mark as Complete"}
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      setQuizModule(m);
                      setOpen(true);
                    }}
                  >
                    Start Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <QuizDialog module={quizModule} open={open} onOpenChange={setOpen} onFinish={saveScore} />
    </div>
  );
}
