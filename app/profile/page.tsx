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
    "3": "Contract Types",
    "4": "Work Regions",
    "5": "Salary Range",
    "6": "Work Authorization",
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <section className="relative z-10 bg-background py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Link
                href="/jobs"
                className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Jobs
              </Link>
            </div>

            <div className="text-center space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-none text-foreground">
                Your{" "}
                <span className="text-primary relative inline-block">
                  Profile
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                View your account information and preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-4xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="border border-border bg-background rounded-lg shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-muted-foreground">Email:</span>
                <span className="font-bold text-foreground">{user.email}</span>
                {user.emailVerified ? (
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    Verified
                  </span>
                ) : (
                  <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-200">
                    Unverified
                  </span>
                )}
              </div>
              {user.name && (
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">Name:</span>
                  <span className="font-bold text-foreground">{user.name}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-muted-foreground">Role:</span>
                <span className="font-bold text-foreground capitalize">{user.role}</span>
              </div>
            </div>
          </div>

          {preferences && Object.keys(answersByQuestionId).length > 0 ? (
            <div className="border border-border bg-background rounded-lg shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Your Preferences
              </h2>

              {selectedCategory && (
                <div className="bg-secondary/30 px-4 py-3 rounded-lg border border-border">
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Selected Category</span>
                    <p className="text-lg font-bold text-foreground mt-0.5">{selectedCategory}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {Object.entries(answersByQuestionId).map(([questionId, answers]) => {
                  if (!Array.isArray(answers) || answers.length === 0) return null;

                  const question = questions.find((q) => String(q.id) === questionId);
                  const label = questionLabels[questionId] || `Question ${questionId}`;

                  return (
                    <div key={questionId} className="border border-border/50 bg-background rounded-lg p-5 space-y-2">
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                        {label}
                      </h3>
                      {question && (
                        <p className="text-base font-medium text-foreground">{question.label}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {answers.map((answer: string, idx: number) => (
                          <span
                            key={`${questionId}-${idx}-${answer}`}
                            className="inline-block bg-secondary text-secondary-foreground px-3 py-1 text-sm font-bold rounded"
                          >
                            {answer}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-border mt-8">
                <Link
                  href="/join?from=profile"
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
                >
                  Update Preferences
                </Link>
              </div>
            </div>
          ) : (
            <div className="border border-border bg-background rounded-lg shadow-sm p-12 space-y-4 text-center">
              <h2 className="text-2xl font-bold text-foreground">No Preferences Yet</h2>
              <p className="text-base font-medium text-muted-foreground max-w-md mx-auto">
                Complete the onboarding questionnaire to personalize your job search experience and get better matches.
              </p>
              <div className="pt-4">
                <Link
                  href="/join?from=profile"
                  className="inline-flex items-center gap-2 px-8 py-3 text-base font-bold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
                >
                  Start Onboarding
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
