"use client";

import { useEffect, useState } from "react";
import { getJoinQuestions } from "@/lib/join-questions";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "workiswork_join_preferences";

export function JoinWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
      setPreferencesSaved(true);
    } else {
      setStep((s) => Math.min(s + 1, total - 1));
    }
  }

  function goBack() {
    if (!isFirst) {
      setStep((s) => Math.max(s - 1, 0));
    }
  }

  async function skipStep() {
    if (isLast) {
      setPreferencesSaved(true);
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

  if (preferencesSaved) {
    return (
      <div className="bg-white border-2 border-black p-12 text-center space-y-8 shadow-[12px_12px_0px_black] animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-orange-500 flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_black]">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-black tracking-tighter uppercase italic leading-none">Protocol Optimized</h2>
          <p className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-400 max-w-md mx-auto leading-relaxed">
            YOUR RECRUITMENT PARAMETERS HAVE BEEN SAVED. <br />
            WE ARE CURATING THE NETWORK FOR YOUR SPECIFICATIONS.
          </p>
        </div>
        <div className="flex justify-center pt-6">
          <Link
            href="/jobs"
            className="group relative bg-black text-white px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] transition-all overflow-hidden"
          >
            <span className="relative z-10">Access Marketplace</span>
            <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white border-2 border-black shadow-[12px_12px_0px_black] overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-100">
          <div
            className="h-full bg-orange-500 transition-all duration-700 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-8 sm:p-12 md:p-16 space-y-12">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-4">
              <span className="text-[10px] font-black text-black uppercase tracking-[0.4em]">
                PHASE {step + 1} // {total}
              </span>
              {isSkillsQuestion && (
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em]">
                  {currentAnswers.length}/{maxSkills} ACQUIRED
                </span>
              )}
            </div>
            <h2 className="text-4xl font-black text-black tracking-tighter uppercase italic leading-none">
              {current.label}
            </h2>
            {current.helper && (
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                {current.helper}
              </p>
            )}
          </div>

          <div className="max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      "w-full px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.2em] border-2 transition-all relative group",
                      disabled
                        ? "bg-gray-50 text-gray-200 border-gray-100 cursor-not-allowed"
                        : selected
                          ? "bg-black text-white border-black shadow-[4px_4px_0px_#f97316]"
                          : "bg-white text-black border-black hover:bg-orange-50 hover:border-orange-500"
                    )}
                  >
                    {opt}
                    {selected && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="w-4 h-4 text-orange-500 px-0.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-8 border-t-2 border-black flex flex-col items-center gap-8">
            <button
              type="button"
              onClick={goNext}
              disabled={!canProceed || isSaving}
              className="group relative w-full h-16 bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-[8px_8px_0px_rgba(0,0,0,0.1)] active:scale-[0.98] overflow-hidden disabled:opacity-30"
            >
              <span className="relative z-10">{isLast ? "SYNCHRONIZE PREFERENCES" : "PROCEED TO NEXT PHASE"}</span>
              <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>

            <div className="flex items-center gap-12">
              {!isFirst && (
                <button
                  type="button"
                  onClick={goBack}
                  className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                >
                  ← REVERT PHASE
                </button>
              )}

              {!isLast && (
                <button
                  type="button"
                  onClick={skipStep}
                  disabled={isSaving}
                  className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-orange-500 transition-colors"
                >
                  BYPASS STEP
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
