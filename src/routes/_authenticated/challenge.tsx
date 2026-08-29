import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { useProgress, useUpdateProgress } from "@/hooks/useProgress";
import { CHALLENGE_DAYS } from "@/lib/digigrow-data";

export const Route = createFileRoute("/_authenticated/challenge")({
  head: () => ({
    meta: [
      { title: "7-Day Marketing Challenge — DigiGrow" },
      {
        name: "description",
        content: "One small marketing action each day for a week to grow your small business.",
      },
      { property: "og:title", content: "7-Day Marketing Challenge — DigiGrow" },
      { property: "og:description", content: "One simple marketing task per day for seven days." },
    ],
  }),
  component: ChallengePage,
});

function ChallengePage() {
  const { data: progress } = useProgress();
  const updateProgress = useUpdateProgress();
  const days = progress?.challenge_days ?? [];
  const percent = Math.round((days.length / CHALLENGE_DAYS.length) * 100);

  function toggleDay(day: number) {
    const next = days.includes(day) ? days.filter((d) => d !== day) : [...days, day].sort();
    updateProgress.mutate(
      { challenge_days: next },
      {
        onSuccess: () => {
          if (next.length === CHALLENGE_DAYS.length) toast.success("Challenge complete! 🎉");
          else if (!days.includes(day)) toast.success(`Day ${day} done!`);
        },
        onError: () => toast.error("Could not save your progress."),
      },
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold md:text-4xl">7-Day Marketing Challenge</h1>
      <p className="mt-2 text-muted-foreground">
        One small action each day. Ten minutes is enough.
      </p>

      <div className="mt-6 rounded-3xl border border-border bg-gradient-soft p-5 shadow-card">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>
            {days.length} of {CHALLENGE_DAYS.length} days complete
          </span>
          <span>{percent}%</span>
        </div>
        <ProgressBar value={percent} className="mt-3 h-3" />
      </div>

      {days.length === CHALLENGE_DAYS.length && (
        <Card className="mt-6 rounded-3xl border-success/40 bg-success/10 shadow-card">
          <CardContent className="flex items-center gap-3 p-6">
            <PartyPopper className="h-6 w-6 text-success" />
            <p className="font-semibold">
              Congratulations! You finished the 7-Day Marketing Challenge.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 space-y-4">
        {CHALLENGE_DAYS.map((d) => {
          const done = days.includes(d.day);
          return (
            <Card
              key={d.day}
              className={`rounded-3xl border-border/70 shadow-card transition-colors ${done ? "bg-success/5" : ""}`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-base">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                      done
                        ? "bg-success text-success-foreground"
                        : "bg-gradient-primary text-primary-foreground"
                    }`}
                  >
                    {d.day}
                  </span>
                  {d.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{d.task}</p>
                <Button
                  variant={done ? "outline" : "default"}
                  className={`rounded-full ${done ? "" : "bg-gradient-primary"}`}
                  onClick={() => toggleDay(d.day)}
                  disabled={updateProgress.isPending}
                >
                  {done ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4 text-success" /> Completed
                    </>
                  ) : (
                    <>
                      <Circle className="mr-2 h-4 w-4" /> Mark Day {d.day} Done
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
