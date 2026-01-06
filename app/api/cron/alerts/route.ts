// app/api/cron/alerts/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { and, gt, ilike, or, sql, eq } from "drizzle-orm";
import { db } from "../../../../db";
import { alerts, jobs, users } from "../../../../db/schema";
import { sendAlertEmail } from "../../../../lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Simple shared secret so random people can't hit this
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Daily digest: jobs from last 24h
  const now = new Date();
  const since = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const recentJobs = await db
    .select({
      id: jobs.id,
      title: jobs.title,
      descriptionHtml: jobs.descriptionHtml,
      tags: jobs.tags,
      postedAt: jobs.postedAt,
    })
    .from(jobs)
    .where(gt(jobs.postedAt, since));

  if (!recentJobs.length) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  // Load all active alerts
  const allAlerts = await db
    .select({
      id: alerts.id,
      email: alerts.email,
      keyword: alerts.keyword,
      frequency: alerts.frequency,
      userId: alerts.userId,
    })
    .from(alerts)
    .where(eq(alerts.isActive, true));

  // Naive matching: keyword contained in title or tags.
  // We aggregate per user so each user gets a single digest email.
  const emailsToSend: Record<
    string,
    { keywords: Set<string>; jobTitles: Set<string> }
  > = {};

  for (const alert of allAlerts) {
    if (!alert.keyword) continue;
    const kw = alert.keyword.toLowerCase();

    const matched = recentJobs.filter((job) => {
      const inTitle = job.title.toLowerCase().includes(kw);
      const inTags = (job.tags || []).some((t) =>
        t.toLowerCase().includes(kw),
      );
      return inTitle || inTags;
    });

    if (matched.length === 0) continue;

    const emailKey = alert.email;
    if (!emailsToSend[emailKey]) {
      emailsToSend[emailKey] = {
        keywords: new Set<string>(),
        jobTitles: new Set<string>(),
      };
    }
    emailsToSend[emailKey].keywords.add(alert.keyword);
    matched.forEach((j) => emailsToSend[emailKey].jobTitles.add(j.title));
  }

  // Send emails via Resend, sequentially with a small delay to avoid rate limits
  let sent = 0;
  for (const [email, payload] of Object.entries(emailsToSend)) {
    const keywordSummary = Array.from(payload.keywords).join(", ");
    await sendAlertEmail({
      to: email,
      keyword: keywordSummary || "your alerts",
      frequency: "daily",
      jobTitles: Array.from(payload.jobTitles).slice(0, 10),
    });
    sent += 1;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return NextResponse.json({ ok: true, sent });
}