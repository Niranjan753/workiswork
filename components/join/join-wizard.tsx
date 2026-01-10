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
      <div className="relative min-h-screen bg-white text-black overflow-hidden">
        <GridBackground />
        
        <section className="relative z-10 bg-transparent py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-black">
                Preferences{" "}
                <span className="inline-block bg-yellow-300 px-2 py-1 border-2 border-black">
                  Updated
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-black/90 max-w-2xl mx-auto font-medium leading-relaxed">
                Your preferences have been saved successfully. We'll use these to personalize your job search experience.
              </p>
            </div>
          </div>
        </section>

        <div className="relative z-10 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-3xl border-2 border-black bg-white shadow-lg p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-yellow-400 border-4 border-black flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-black" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-black">All Done!</h2>
              <p className="text-sm font-medium text-black/70">
                Your preferences have been saved. You can now use the Optimise button to find jobs that match your selections.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Link
                href="/profile"
                className="px-6 py-3 text-sm font-bold border-2 border-black bg-yellow-400 text-black hover:bg-black hover:text-yellow-400 transition-all shadow-lg cursor-pointer"
              >
                View Profile
              </Link>
              <Link
                href="/jobs"
                className="px-6 py-3 text-sm font-bold border-2 border-black bg-white text-black hover:bg-black hover:text-yellow-400 transition-all shadow-lg cursor-pointer"
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
    <div className="relative min-h-screen bg-white text-black overflow-hidden">
      <GridBackground />

      <section className="relative z-10 bg-transparent py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-black">
              {isSignedIn ? "Update Your" : "Join the"}{" "}
              <span className="inline-block bg-yellow-300 px-2 py-1 border-2 border-black">
                {isSignedIn ? "Preferences" : "WorkIsWork"}
              </span>{" "}
              {isSignedIn ? "" : "community"}
            </h1>
            <p className="text-lg sm:text-xl text-black/90 max-w-2xl mx-auto font-medium leading-relaxed">
              {isSignedIn 
                ? "Update your preferences to better match you with remote roles and opportunities."
                : "Answer a few quick questions so we can better match you with remote roles and opportunities."
              }
            </p>
          </div>
        </div>
      </section>

      <div className="relative z-10 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-3xl border-2 border-black bg-white shadow-lg">
          <div className="w-full h-2 bg-white border-b-2 border-black">
            <div
              className="h-full bg-yellow-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="px-6 py-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-medium text-black/60">
              <span>
                Step {step + 1} of {total}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>

            {selectedCategory && step > 0 && (
              <div className="flex items-center gap-2 text-xs font-medium text-black/70 bg-yellow-100 px-3 py-2 border border-black">
                <span className="font-bold">Category:</span>
                <span>{selectedCategory}</span>
                {step < 3 && (
                  <button
                    type="button"
                    onClick={() => {
                      setStep(0);
                    }}
                    className="ml-auto text-xs font-bold underline hover:no-underline"
                  >
                    Change
                  </button>
                )}
              </div>
            )}

            <div className="space-y-2">
              <h1 className="text-lg sm:text-xl font-bold">
                {current.label}
              </h1>
              {current.helper && (
                <p className="text-sm text-black/70 font-medium">
                  {current.helper}
                </p>
              )}
              {isSkillsQuestion && (
                <p className="text-xs text-black/60 font-medium pt-1">
                  Select up to {maxSkills} skills ({currentAnswers.length}/{maxSkills} selected)
                </p>
              )}
            </div>

            <div className="mt-4 space-y-2">
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
                      "w-full text-left px-4 py-3 cursor-pointer text-sm font-bold border-2 border-black transition-all " +
                      (disabled
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : selected
                        ? "bg-yellow-400 text-black shadow-lg"
                        : "bg-white text-black hover:bg-yellow-100")
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span>{opt}</span>
                      {selected && (
                        <span className="text-lg font-black">✓</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex gap-3">
                {!isFirst && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex-1 px-4 py-3 text-sm font-bold border-2 border-black bg-white text-black hover:bg-black hover:text-yellow-400 transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canProceed || isSaving}
                  className={`${isFirst ? "w-full" : "flex-1"} px-4 py-3 text-sm font-bold border-2 border-black bg-yellow-400 text-black hover:bg-black hover:text-yellow-400 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black cursor-pointer disabled:hover:text-yellow-400 flex items-center justify-center gap-2`}
                >
                  {isSaving ? "Saving..." : isLast ? (isSignedIn ? "Save Preferences" : "Finish") : "Continue"}
                  {!isLast && !isSaving && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>

              {!isLast && (
                <button
                  type="button"
                  onClick={skipStep}
                  disabled={isSaving}
                  className="w-full px-4 py-3 text-sm font-bold border-2 border-black bg-white text-black hover:bg-black hover:text-yellow-400 transition-all shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Skip this step
                </button>
              )}

              {isLast && !isSignedIn && (
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
    </div>
  );
}
