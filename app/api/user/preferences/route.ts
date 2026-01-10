import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { auth } from "../../../../lib/auth";
import { db } from "../../../../db";
import { userPreferences } from "../../../../db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const preferencesSchema = z.object({
  answersByQuestionId: z.record(z.string(), z.array(z.string())),
  selectedCategory: z.string().optional().nullable(),
});

export async function GET() {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });

  if (!session?.user?.id) {
    return NextResponse.json({ preferences: null }, { status: 200 });
  }

  const row = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, session.user.id))
    .limit(1)
    .then((rows) => rows[0]);

  if (!row) {
    return NextResponse.json({ preferences: null }, { status: 200 });
  }

  try {
    const parsed = JSON.parse(row.data);
    return NextResponse.json({ preferences: parsed }, { status: 200 });
  } catch {
    return NextResponse.json({ preferences: null }, { status: 200 });
  }
}

export async function POST(request: Request) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = preferencesSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const dataToSave = {
    answersByQuestionId: parsed.data.answersByQuestionId,
    selectedCategory: parsed.data.selectedCategory || null,
  };
  const payload = JSON.stringify(dataToSave);

  // Upsert by userId – simple delete + insert
  await db.delete(userPreferences).where(eq(userPreferences.userId, session.user.id));

  await db
    .insert(userPreferences)
    .values({
      userId: session.user.id,
      data: payload,
    });

  return NextResponse.json({ success: true });
}


