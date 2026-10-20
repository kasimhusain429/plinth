import { NextResponse } from "next/server";
import { validateInquiry } from "@/lib/validate";

// Tiny in-memory rate limiter (per server instance). Swap for Redis/Upstash in production.
const hits = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 6;

function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_HITS;
}

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ ok: false, errors: { message: "Invalid request." } }, { status: 400 });
  }

  // Honeypot: pretend success so bots learn nothing.
  if (data.company) return NextResponse.json({ ok: true, reference: "PL-0000" });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, errors: { message: "Too many requests — please try again later." } }, { status: 429 });
  }

  const { valid, errors } = validateInquiry(data);
  if (!valid) return NextResponse.json({ ok: false, errors }, { status: 400 });

  const reference = `PL-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  // ──────────────────────────────────────────────────────────────
  // TODO (production): deliver the inquiry. Examples: send an email with
  // Resend / Postmark / SendGrid, post to a CRM, or insert into a database.
  // For local development we log it so you can see the payload.
  // ──────────────────────────────────────────────────────────────
  console.log("[inquiry]", reference, {
    name: String(data.name).trim(),
    email: String(data.email).trim(),
    phone: String(data.phone || "").trim(),
    topic: data.topic,
    listing: data.listing?.slug || null,
    date: data.date || null,
    slot: data.slot || null,
    format: data.format || null,
    message: String(data.message || "").trim().slice(0, 2000),
  });

  return NextResponse.json({ ok: true, reference });
}
