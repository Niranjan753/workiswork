import { NextResponse } from "next/server";

const POLAR_API_BASE = process.env.POLAR_API_BASE?.replace(/\/+$/, "") || "https://api.polar.sh/v1";
const POLAR_ACCESS_TOKEN = process.env.POLAR_ACCESS_TOKEN;

export type PolarCheckout = {
  id: string;
  url?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  customer_id?: string | null;
  subscription_id?: string | null;
  product_id?: string | null;
};

type PolarRequestInit = RequestInit & { path: string };

async function polarRequest<T>(init: PolarRequestInit): Promise<T> {
  if (!POLAR_ACCESS_TOKEN) {
    throw new Error("POLAR_ACCESS_TOKEN is not configured");
  }

  const { path, ...rest } = init;
  const response = await fetch(`${POLAR_API_BASE}${path}`, {
    ...rest,
    headers: {
      Authorization: `Bearer ${POLAR_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      ...(rest.headers || {}),
    },
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const detail = body?.detail || body?.message || text || "Unknown Polar API error";
    throw new Error(`Polar API ${response.status}: ${detail}`);
  }

  return body as T;
}

export async function createPolarCheckout(payload: Record<string, unknown>) {
  return polarRequest<PolarCheckout>({
    path: "/checkouts/",
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function retrievePolarCheckout(checkoutId: string) {
  return polarRequest<PolarCheckout>({
    path: `/checkouts/${checkoutId}`,
    method: "GET",
  });
}

export function ensurePolarConfig(config: { jobProductId?: string | null; membershipProductId?: string | null }) {
  if (!POLAR_ACCESS_TOKEN) {
    return NextResponse.json({ error: "POLAR_ACCESS_TOKEN is not configured" }, { status: 500 });
  }

  if (config.jobProductId !== undefined && !config.jobProductId) {
    return NextResponse.json({ error: "POLAR_JOB_PRODUCT_ID is not configured" }, { status: 500 });
  }

  if (config.membershipProductId !== undefined && !config.membershipProductId) {
    return NextResponse.json({ error: "POLAR_MEMBERSHIP_PRODUCT_ID is not configured" }, { status: 500 });
  }

  return null;
}
