import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { headers } from "next/headers";

import { db } from "../../../db";
import { alerts, users } from "../../../db/schema";
import { auth } from "../../../lib/auth";
import { sendAlertEmail } from "../../../lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const createAlertSchema = z.object({
  email: z.string().email(),
  keyword: z.string().min(2),
  frequency: z.enum(["daily", "weekly"]).default("daily"),
});

export async function GET(request: Request) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  const { searchParams } = new URL(request.url);

  let email = session?.user?.email || "";
  if (!email) {
    email = searchParams.get("email") || "";
  }
  if (!email) {
    return NextResponse.json(
      { error: "Email or authenticated user required" },
      { status: 400 },
    );
  }

  const userRow = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    .then((rows) => rows[0]);

  if (!userRow) {
    return NextResponse.json({ alerts: [] });
  }

  const userAlerts = await db
    .select()
    .from(alerts)
    .where(eq(alerts.userId, userRow.id))
    .orderBy(alerts.createdAt);

  return NextResponse.json({ alerts: userAlerts });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createAlertSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { email, keyword, frequency } = parsed.data;

  // Find or create user for this email
  let userRow = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1)
    .then((rows) => rows[0]);

  if (!userRow) {
    const inserted = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        name: email.split("@")[0],
      })
      .returning()
      .then((rows) => rows[0]);
    userRow = inserted;
  }

  const insertedAlert = await db
    .insert(alerts)
    .values({
      userId: userRow.id,
      email: email.toLowerCase(),
      keyword,
      frequency,
      isActive: true,
    })
    .returning()
    .then((rows) => rows[0]);

  // fire-and-forget email confirmation if Resend is configured
  sendAlertEmail({
    to: email.toLowerCase(),
    keyword,
    frequency: frequency as "daily" | "weekly",
  }).catch(() => {});

  return NextResponse.json({ alert: insertedAlert }, { status: 201 });
}


