"use client";

import { useEffect, useState } from "react";
import { getJoinQuestions } from "@/lib/join-questions";
import type { JoinQuestion } from "@/lib/join-questions";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GridBackground } from "@/components/GridBackground";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

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
      <div className="relative min-h-screen bg-[#0B0B0B] text-white selection:bg-blue-500/30">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.1)_0%,transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <section className="relative z-10 pt-12 sm:pt-24 pb-16 text-center px-4">
          <div className="mx-auto max-w-5xl">
            <h1 className="font-semibold tracking-tighter mt-12 sm:mt-16 text-[36px] leading-[1.1] sm:text-[56px] md:text-[80px] lg:text-[90px]">
              Preferences
              <br />
              <span className="text-[#FF5A1F]">Updated Successfully</span>
            </h1>
            <p className="mt-8 text-[16px] sm:text-[22px] md:text-[24px] max-w-2xl mx-auto leading-[1.2] text-[#B6B6B6] px-4">
              Your preferences have been saved. We&apos;ll use these to personalize your job search experience.
            </p>
          </div>
        </section>

        <div className="relative z-10 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-3xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md shadow-2xl rounded-3xl p-10 text-center space-y-8">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <CheckCircle2 className="w-10 h-10 text-blue-500" />
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-white tracking-tight">All Done!</h2>
              <p className="text-lg font-medium text-zinc-400">
                Your profile is now optimised. Start discovery now.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/profile"
                className="px-8 py-3.5 text-base font-bold bg-[#2563EB] text-white rounded-2xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/20 cursor-pointer"
              >
                View Profile
              </Link>
              <Link
                href="/jobs"
                className="px-8 py-3.5 text-base font-bold border border-zinc-800 bg-zinc-800/50 text-white rounded-2xl hover:bg-zinc-800 transition-all shadow-sm cursor-pointer"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0B0B0B] text-white selection:bg-blue-500/30">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.1)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <section className="relative z-10 sm:pt-24 pb-16 text-center px-4">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-semibold tracking-tighter mt-12 sm:mt-16 text-[36px] leading-[1.1] sm:text-[56px] md:text-[80px] lg:text-[90px]">
            {isSignedIn ? "Update Your" : "Join the"}
            <br />
            <span className="text-[#FF5A1F]">{isSignedIn ? "Preferences" : "WorkIsWork"}</span> {isSignedIn ? "" : "community"}
          </h1>
          <p className="mt-8 text-[16px] sm:text-[22px] md:text-[24px] max-w-3xl mx-auto leading-[1.2] text-[#B6B6B6] px-4">
            {isSignedIn
              ? "Update your preferences to better match you with remote roles and opportunities."
              : "Answer a few quick questions so we can better match you with remote roles and opportunities."
            }
          </p>
          {!isSignedIn && (
            <div className="mt-8">
              <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">
                Already joined?{" "}
                <Link
                  href="/sign-in?callbackUrl=/jobs"
                  className="text-white hover:text-blue-400 underline underline-offset-4 transition-colors"
                >
                  Login now
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="relative z-10 flex items-center justify-center px-4 pb-24">
        <div className="w-full max-w-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden">
          <div className="w-full h-1.5 bg-zinc-800">
            <div
              className="h-full bg-blue-600 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="px-8 py-10 space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                {current.label}
              </h2>
              {current.helper && (
                <p className="text-lg font-medium text-zinc-400">
                  {current.helper}
                </p>
              )}
              {isSkillsQuestion && (
                <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 pt-1">
                  Select up to {maxSkills} skills ({currentAnswers.length}/{maxSkills} selected)
                </p>
              )}
            </div>

            {selectedCategory && step > 0 && (
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-zinc-500 bg-zinc-800/50 px-4 py-3 border border-zinc-800 rounded-xl">
                <span>Category:</span>
                <span className="text-white">{selectedCategory}</span>
                {step < 3 && (
                  <button
                    type="button"
                    onClick={() => {
                      setStep(0);
                    }}
                    className="ml-auto text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    Change
                  </button>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {current.options.map((opt) => {
                const selected = currentAnswers.includes(opt);
                const disabled = isSkillsQuestion && !selected && currentAnswers.length >= maxSkills;

                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    disabled={disabled}
                    className={
                      "flex-1 min-w-[200px] px-6 py-5 cursor-pointer text-base font-bold border rounded-2xl transition-all text-center " +
                      (disabled
                        ? "bg-zinc-800/30 text-zinc-600 border-zinc-800/50 cursor-not-allowed"
                        : selected
                          ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-900/20"
                          : "bg-zinc-800/30 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white hover:bg-zinc-800/80")
                    }
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="pt-6 space-y-4">
              <button
                type="button"
                onClick={goNext}
                disabled={!canProceed || isSaving}
                className="w-full px-8 py-5 text-lg font-bold bg-[#2563EB] text-white rounded-2xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]"
              >
                {isSaving ? "Saving..." : isLast ? (isSignedIn ? "Save Preferences" : "Get Started") : "Continue"}
              </button>

              <div className="flex flex-col gap-2">
                {!isFirst && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="w-full py-3 text-sm font-bold text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  >
                    ← Back
                  </button>
                )}

                {!isLast && (
                  <button
                    type="button"
                    onClick={skipStep}
                    disabled={isSaving}
                    className="w-full py-3 text-sm font-bold text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  >
                    Skip this step
                  </button>
                )}
              </div>

              {isLast && !isSignedIn && (
                <p className="pt-4 text-xs font-bold uppercase tracking-widest text-zinc-600 text-center">
                  All set?{" "}
                  <Link href="/jobs" className="text-zinc-400 hover:text-white underline underline-offset-4">
                    Browse jobs directly
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
