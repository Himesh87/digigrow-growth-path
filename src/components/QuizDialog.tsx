import { useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import type { Module } from "@/lib/digigrow-data";

type Props = {
  module: Module | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFinish: (moduleId: string, score: number) => void;
};

export function QuizDialog({ module, open, onOpenChange, onFinish }: Props) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (!module) return null;
  const total = module.quiz.length;
  const q = module.quiz[index]!;

  function reset() {
    setIndex(0);
    setSelected(null);
    setChecked(false);
    setScore(0);
    setDone(false);
  }

  function handleCheck() {
    if (selected === null) return;
    setChecked(true);
    if (selected === q.answer) setScore((s) => s + 1);
  }

  function handleNext() {
    const finalScore = score;
    if (index + 1 >= total) {
      setDone(true);
      onFinish(module!.id, finalScore);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setChecked(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-lg rounded-3xl">
        <DialogHeader>
          <DialogTitle>{module.title} Quiz</DialogTitle>
          <DialogDescription>
            {done ? "Quiz completed" : `Question ${index + 1} of ${total}`}
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="space-y-5 py-2 text-center">
            <p className="text-4xl font-extrabold text-gradient">
              {score}/{total}
            </p>
            <p className="text-sm text-muted-foreground">
              {score === total
                ? "Perfect score! You're ready to apply this. 🎉"
                : "Nice work — try again to improve your score."}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" className="flex-1 rounded-full" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" /> Try Again
              </Button>
              <Button
                className="flex-1 rounded-full bg-gradient-primary"
                onClick={() => {
                  reset();
                  onOpenChange(false);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Progress value={((index + (checked ? 1 : 0)) / total) * 100} />
            <p className="font-semibold">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const isAnswer = i === q.answer;
                const isSelected = i === selected;
                let cls =
                  "flex w-full items-center justify-between rounded-2xl border border-border px-4 py-3 text-left text-sm transition-colors hover:bg-accent";
                if (checked && isAnswer) cls += " border-success bg-success/10";
                else if (checked && isSelected) cls += " border-destructive bg-destructive/10";
                else if (isSelected) cls += " border-primary bg-accent";
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={checked}
                    className={cls}
                    onClick={() => setSelected(i)}
                  >
                    <span>{opt}</span>
                    {checked && isAnswer && <CheckCircle2 className="h-4 w-4 text-success" />}
                    {checked && isSelected && !isAnswer && (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                  </button>
                );
              })}
            </div>

            {checked && (
              <p className="text-sm font-medium">
                {selected === q.answer ? (
                  <span className="text-success">Correct! 🎉</span>
                ) : (
                  <span className="text-destructive">
                    Incorrect. Correct answer: {q.options[q.answer]}
                  </span>
                )}
              </p>
            )}

            {checked ? (
              <Button className="w-full rounded-full bg-gradient-primary" onClick={handleNext}>
                {index + 1 >= total ? "See My Score" : "Next Question"}
              </Button>
            ) : (
              <Button
                className="w-full rounded-full bg-gradient-primary"
                disabled={selected === null}
                onClick={handleCheck}
              >
                Check Answer
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
