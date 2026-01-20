"use client";

import { useEffect, useState } from "react";
import { getJoinQuestions } from "@/lib/join-questions";
import type { JoinQuestion } from "@/lib/join-questions";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GridBackground } from "@/components/GridBackground";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "workiswork_join_preferences";

export function JoinWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromProfile = searchParams.get("from") === "profile";
  const { data: session } = authClient.useSession();
  const isSignedIn = !!session?.user;
  const [step, setStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[][]>(() => []);
  const [maxSkills] = useState(3);
  const [preferencesSaved, setPreferencesSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const questions = getJoinQuestions(selectedCategory || undefined);

  const current = questions[step] || questions[0];
  const total = questions.length;
  const isFirst = step === 0;
  const isLast = step >= total - 1;
  const progress = total > 0 ? ((step + 1) / total) * 100 : 0;
  const currentAnswers = answers[step] || [];
  const canProceed = currentAnswers.length > 0 || isLast;
  const isSkillsQuestion = step === 2;
  const canSelectMore = isSkillsQuestion ? currentAnswers.length < maxSkills : true;

  useEffect(() => {
    if (step >= total && total > 0) {
      setStep(total - 1);
    }
  }, [step, total]);

  useEffect(() => {
    if (step === 0 && answers[0]?.length > 0) {
      const category = answers[0][0];
      if (category !== selectedCategory) {
        setSelectedCategory(category);
        const newAnswers = [...answers];
        newAnswers[1] = [];
        newAnswers[2] = [];
        setAnswers(newAnswers);
        if (step > 0 && step <= 2) {
          setStep(1);
        }
      }
    }
  }, [answers, selectedCategory, step]);

  function handleSelect(option: string) {
    setAnswers((prev) => {
      const next = prev.map((arr) => [...arr]);
      while (next.length <= step) {
        next.push([]);
      }
      const set = new Set(next[step] || []);

      if (step === 0) {
        next[step] = set.has(option) ? [] : [option];
        return next;
      }

      if (set.has(option)) {
        set.delete(option);
      } else {
        if (isSkillsQuestion && currentAnswers.length >= maxSkills) {
          return next;
        }
        set.add(option);
      }

      next[step] = Array.from(set);
      return next;
    });
  }

  async function goNext() {
    if (isLast) {
      if (isSignedIn) {
        await savePreferencesToDatabase();
        setPreferencesSaved(true);
      } else {
        router.push("/sign-up?callbackUrl=/jobs&from=join");
      }
    } else {
      setStep((s) => Math.min(s + 1, total - 1));
    }
  }

  async function savePreferencesToDatabase() {
    setIsSaving(true);
    try {
      const answersByQuestionId: Record<string, string[]> = {};
      questions.forEach((q, idx) => {
        answersByQuestionId[String(q.id)] = answers[idx] ?? [];
      });
      const payload = { answersByQuestionId, selectedCategory };

      const res = await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setPreferencesSaved(true);
      }
    } catch (error) {
      console.error("Failed to save preferences:", error);
    } finally {
      setIsSaving(false);
    }
  }

  function goBack() {
    if (!isFirst) {
      setStep((s) => Math.max(s - 1, 0));
    }
  }

  async function skipStep() {
    if (isLast) {
      if (isSignedIn) {
        await savePreferencesToDatabase();
        setPreferencesSaved(true);
      } else {
        router.push("/sign-up?callbackUrl=/jobs&from=join");
      }
    } else {
      setStep((s) => Math.min(s + 1, total - 1));
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const answersByQuestionId: Record<string, string[]> = {};
    questions.forEach((q, idx) => {
      answersByQuestionId[String(q.id)] = answers[idx] ?? [];
    });
    const payload = { answersByQuestionId, selectedCategory };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [answers, selectedCategory, questions]);

  if (preferencesSaved && isSignedIn) {
    return (
      <div className="bg-white border border-gray-100 shadow-xl shadow-gray-200/50 rounded-[2.5rem] p-12 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Preferences Updated!</h2>
          <p className="text-xl font-medium text-gray-500 max-w-md mx-auto leading-relaxed">
            Your profile is now optimised. We&apos;ll use these details to show you the best remote opportunities.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link
            href="/dashboard/portfolio"
            className="px-8 py-4 text-base font-bold bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            Go to Portfolio
          </Link>
          <Link
            href="/dashboard/jobs"
            className="px-8 py-4 text-base font-bold bg-gray-900 text-white rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white border border-gray-100 shadow-xl shadow-gray-200/50 rounded-[2.5rem] overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-50">
          <div
            className="h-full bg-blue-600 transition-all duration-700 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-8 sm:p-10 space-y-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                Step {step + 1} of {total}
              </span>
              {isSkillsQuestion && (
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  {currentAnswers.length}/{maxSkills} Selected
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
              {current.label}
            </h2>
            {current.helper && (
              <p className="text-base font-medium text-gray-500 leading-relaxed">
                {current.helper}
              </p>
            )}
          </div>

          <div className="max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {current.options.map((opt) => {
                const selected = currentAnswers.includes(opt);
                const disabled = isSkillsQuestion && !selected && currentAnswers.length >= maxSkills;

                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    disabled={disabled}
                    className={cn(
                      "w-full px-5 py-3 text-left text-[14px] font-bold border rounded-xl transition-all shadow-sm group relative",
                      disabled
                        ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                        : selected
                          ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20"
                          : "bg-white text-gray-600 border-gray-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/10"
                    )}
                  >
                    {opt}
                    {selected && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6 flex flex-col items-center gap-6">
            <button
              type="button"
              onClick={goNext}
              disabled={!canProceed || isSaving}
              className="w-full px-8 py-4 text-lg font-bold bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isSaving ? "Saving..." : isLast ? "Save Preferences" : "Continue"}
            </button>

            <div className="flex items-center gap-8">
              {!isFirst && (
                <button
                  type="button"
                  onClick={goBack}
                  className="text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors"
                >
                  ← Previous Step
                </button>
              )}

              {!isLast && (
                <button
                  type="button"
                  onClick={skipStep}
                  disabled={isSaving}
                  className="text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors"
                >
                  Skip for now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
