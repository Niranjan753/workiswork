"use client";

import { useEffect, useState } from "react";
import type { JoinQuestion } from "@/lib/join-questions";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  questions: JoinQuestion[];
};

const STORAGE_KEY = "workiswork_join_preferences";

export function JoinWizard({ questions }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[][]>(() =>
    Array.from({ length: questions.length }, () => []),
  );

  const current = questions[step];
  const total = questions.length;
  const isLast = step === total - 1;
  const progress = ((step + 1) / total) * 100;

  function handleSelect(option: string) {
    setAnswers((prev) => {
      const next = prev.map((arr) => [...arr]);
      const set = new Set(next[step]);
      if (set.has(option)) {
        set.delete(option);
      } else {
        set.add(option);
      }
      next[step] = Array.from(set);
      return next;
    });
  }

  function goNext() {
    if (isLast) {
      router.push("/sign-up?callbackUrl=/jobs&from=join");
    } else {
      setStep((s) => s + 1);
    }
  }

  function skipStep() {
    if (isLast) {
      router.push("/sign-up?callbackUrl=/jobs&from=join");
    } else {
      setStep((s) => s + 1);
    }
  }

  // Persist answers so we can save them after sign-up
  useEffect(() => {
    if (typeof window === "undefined") return;
    const answersByQuestionId: Record<string, string[]> = {};
    questions.forEach((q, idx) => {
      answersByQuestionId[String(q.id)] = answers[idx] ?? [];
    });
    const payload = { answersByQuestionId };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [answers, questions]);

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl border-2 border-black bg-white shadow-md">
        {/* Progress bar */}
        <div className="w-full h-1 bg-black/5">
          <div
            className="h-1 bg-yellow-400"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="px-6 py-6 space-y-4">
          {/* Step label */}
          <div className="flex items-center justify-between text-xs font-medium text-black/60">
            <span>
              Step {step + 1} of {total}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>

          {/* Question */}
          <div className="space-y-2">
            <h1 className="text-lg sm:text-xl font-bold">
              {current.label}
            </h1>
            {current.helper && (
              <p className="text-sm text-black/70 font-medium">
                {current.helper}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="mt-4 space-y-2">
            {current.options.map((opt) => {
          const selected = answers[step]?.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className={
                    "w-full text-left px-4 py-3 text-sm border border-black/20 bg-white transition " +
                    (selected
                      ? "border-black bg-yellow-400 font-bold"
                      : "hover:bg-yellow-100")
                  }
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={goNext}
            disabled={answers[step]?.length === 0 && !isLast}
              className="w-full px-4 py-3 text-sm font-bold border-2 border-black bg-black text-white hover:bg-yellow-400 hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLast ? "Finish" : "Keep going"}
            </button>

            <button
              type="button"
              onClick={skipStep}
              disabled={isLast}
              className="w-full px-4 py-3 text-sm font-bold border-2 border-black bg-white text-black hover:bg-black hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Skip this step
            </button>

            {isLast && (
              <p className="pt-2 text-xs text-black/70 text-center font-medium">
                All questions done.{" "}
                <Link href="/jobs" className="font-bold underline">
                  Browse remote jobs
                </Link>
                .
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


