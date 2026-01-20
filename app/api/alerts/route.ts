import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "../../../db";
import { alerts, users } from "../../../db/schema";
import { sendAlertEmail } from "../../../lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const createAlertSchema = z.object({
  email: z.string().email(),
  keyword: z.string().min(2),
  frequency: z.enum(["daily", "weekly"]).default("daily"),
});

/**
 * GET /api/alerts?email=foo@bar.com
 * Fetch alerts for a given email
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
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
  } catch (err: any) {
    console.error("[GET /api/alerts] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/alerts
 * Create an alert for an email
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createAlertSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, keyword, frequency } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    // Find or create user for this email
    let userRow = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1)
      .then((rows) => rows[0]);

    if (!userRow) {
      userRow = await db
        .insert(users)
        .values({
          email: normalizedEmail,
          name: normalizedEmail.split("@")[0],
        })
        .returning()
        .then((rows) => rows[0]);
    }

    const insertedAlert = await db
      .insert(alerts)
      .values({
        userId: userRow.id,
        email: normalizedEmail,
        keyword,
        frequency,
        isActive: true,
      })
      .returning()
      .then((rows) => rows[0]);

    // Fire-and-forget confirmation email
    sendAlertEmail({
      to: normalizedEmail,
      keyword,
      frequency,
    }).catch(() => {});

    return NextResponse.json({ alert: insertedAlert }, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/alerts] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create alert" },
      { status: 500 }
    );
  }
}
