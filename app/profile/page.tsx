import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { userPreferences, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { GridBackground } from "@/components/GridBackground";
import Link from "next/link";
import { getJoinQuestions } from "@/lib/join-questions";
import { ArrowLeft, User, Mail, Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: "Profile – WorkIsWork",
  description: "View and manage your profile and preferences.",
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getUserData() {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });

  if (!session?.user?.id) {
    return null;
  }

  const [user, prefRow] = await Promise.all([
    db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)
      .then((rows) => rows[0]),
    db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, session.user.id))
      .limit(1)
      .then((rows) => rows[0]),
  ]);

  let preferences = null;
  if (prefRow) {
    try {
      const parsed = JSON.parse(prefRow.data);
      preferences = parsed;
    } catch {
      preferences = null;
    }
  }

  return { user, preferences };
}

export default async function ProfilePage() {
  const data = await getUserData();

  if (!data?.user) {
    redirect("/login?callbackUrl=/profile");
  }

  const { user, preferences } = data;
  const selectedCategory = preferences?.selectedCategory || null;
  const answersByQuestionId = preferences?.answersByQuestionId || {};
  const questions = getJoinQuestions(selectedCategory || undefined);

  const questionLabels: Record<string, string> = {
    "0": "Category Interest",
    "1": "Remote Role",
    "2": "Top Skills",
    "3": "Time Zones",
    "4": "Company Types",
    "5": "Salary Range",
    "6": "Work Authorization",
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent text-black">
      <GridBackground />

      <section className="relative z-10 bg-transparent py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Link
                href="/jobs"
                className="flex items-center gap-2 text-sm font-bold text-black hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Jobs
              </Link>
            </div>

            <div className="text-center space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-black">
                Your{" "}
                <span className="inline-block bg-yellow-300 px-2 py-1 border-2 border-black">
                  Profile
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-black/90 max-w-2xl mx-auto font-medium leading-relaxed">
                View your account information and preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-4xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="border-2 border-black bg-white shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-black text-black flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-black/60" />
                <span className="font-medium text-black/80">Email:</span>
                <span className="font-bold text-black">{user.email}</span>
                {user.emailVerified ? (
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 border border-green-600">
                    Verified
                  </span>
                ) : (
                  <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 border border-yellow-600">
                    Unverified
                  </span>
                )}
              </div>
              {user.name && (
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-black/60" />
                  <span className="font-medium text-black/80">Name:</span>
                  <span className="font-bold text-black">{user.name}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Briefcase className="w-4 h-4 text-black/60" />
                <span className="font-medium text-black/80">Role:</span>
                <span className="font-bold text-black capitalize">{user.role}</span>
              </div>
            </div>
          </div>

          {preferences && Object.keys(answersByQuestionId).length > 0 ? (
            <div className="border-2 border-black bg-white shadow-lg p-6 space-y-6">
              <h2 className="text-xl font-black text-black flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Your Preferences
              </h2>
              
              {selectedCategory && (
                <div className="bg-yellow-100 px-4 py-3 border-2 border-black">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-black/60 uppercase tracking-wide">Selected Category</span>
                      <p className="text-lg font-black text-black mt-1">{selectedCategory}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {Object.entries(answersByQuestionId).map(([questionId, answers]) => {
                  if (!Array.isArray(answers) || answers.length === 0) return null;
                  
                  const question = questions.find((q) => String(q.id) === questionId);
                  const label = questionLabels[questionId] || `Question ${questionId}`;
                  
                  return (
                    <div key={questionId} className="border border-black/20 bg-white p-4 space-y-2">
                      <h3 className="text-sm font-bold text-black/80 uppercase tracking-wide">
                        {label}
                      </h3>
                      {question && (
                        <p className="text-base font-medium text-black/90">{question.label}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {answers.map((answer: string, idx: number) => (
                          <span
                            key={`${questionId}-${idx}-${answer}`}
                            className="inline-block bg-yellow-400 px-3 py-1 text-sm font-bold text-black border-2 border-black"
                          >
                            {answer}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-black/20">
                <Link
                  href="/join?from=profile"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold border-2 border-black bg-yellow-400 text-black hover:bg-black hover:text-yellow-400 transition-all shadow-lg"
                >
                  Update Preferences
                </Link>
              </div>
            </div>
          ) : (
            <div className="border-2 border-black bg-white shadow-lg p-6 space-y-4 text-center">
              <h2 className="text-xl font-black text-black">No Preferences Yet</h2>
              <p className="text-sm font-medium text-black/70">
                Complete the onboarding questionnaire to personalize your job search experience.
              </p>
              <Link
                href="/join?from=profile"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold border-2 border-black bg-yellow-400 text-black hover:bg-black hover:text-yellow-400 transition-all shadow-lg"
              >
                Start Onboarding
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

