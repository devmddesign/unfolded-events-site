import { Resend } from "resend";
import type { H3Event } from "h3";

/**
 * Quote-request endpoint. Accepts both a JSON fetch (from the enhanced form) and
 * a native browser form POST (no-JS). Re-validates everything server-side, runs
 * proportionate spam guards, and emails the business via Resend.
 *   - fetch/XHR (X-Requested-With / Accept: application/json) → JSON response
 *   - native form POST (Accept: text/html)                    → 303 /thank-you
 */

interface QuoteFields {
  eventDate: string;
  guests: string;
  items: string[];
  address: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  company_url: string; // honeypot
  form_ts: string; // client render timestamp (ms)
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FILL_MS = 2500; // submissions faster than this look automated
const GENERIC_ERROR =
  "We couldn’t send your request just now. Please try again, or call (240) 555-0142.";

const str = (v: unknown): string => (typeof v === "string" ? v : v == null ? "" : String(v));
const esc = (s: unknown): string =>
  str(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

// Mirror the client validation rules exactly (the client is just the first gate).
function validate(f: QuoteFields): Record<string, string> {
  const e: Record<string, string> = {};
  const d = f.eventDate.trim();
  if (!d) e.eventDate = "Please choose your event date.";
  else {
    const when = new Date(`${d}T23:59:59`);
    if (isNaN(when.getTime())) e.eventDate = "Enter a valid event date.";
    else if (when.getTime() < Date.now() - 24 * 3600 * 1000)
      e.eventDate = "The event date can’t be in the past.";
  }
  const g = f.guests.trim();
  if (!g) e.guests = "Enter the number of guests.";
  else if (!/^\d+$/.test(g) || parseInt(g, 10) < 1)
    e.guests = "Guest count must be a whole number of 1 or more.";
  if (!Array.isArray(f.items) || f.items.length === 0) e.items = "Select at least one item.";
  if (!f.address.trim()) e.address = "Add a delivery address.";
  if (!f.name.trim()) e.name = "Tell us your name.";
  const em = f.email.trim();
  if (!em) e.email = "Enter your email address.";
  else if (!EMAIL_RE.test(em)) e.email = "Enter a valid email address.";
  const ph = f.phone.trim();
  if (!ph) e.phone = "Enter a phone number.";
  else if (!/^[\d+()\-\s]+$/.test(ph) || (ph.match(/\d/g) || []).length < 7)
    e.phone = "Enter a valid phone number.";
  return e;
}

function textBody(f: QuoteFields): string {
  return [
    "New quote request",
    "",
    `Name:        ${f.name}`,
    `Email:       ${f.email}`,
    `Phone:       ${f.phone}`,
    "",
    `Event date:  ${f.eventDate}`,
    `Guest count: ${f.guests}`,
    `Items:       ${f.items.join(", ")}`,
    `Delivery:    ${f.address}`,
    "",
    "Details:",
    f.notes || "(none)",
    "",
    "— Sent from unfoldedevents.com",
  ].join("\n");
}

function htmlBody(f: QuoteFields): string {
  const row = (k: string, v: string) =>
    `<tr><td style="padding:4px 16px 4px 0;color:#6b655c;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:4px 0;color:#211e19">${esc(v) || "—"}</td></tr>`;
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;color:#211e19">
  <h2 style="font-family:Georgia,serif;font-weight:normal;color:#1b1815">New quote request</h2>
  <table style="border-collapse:collapse;font-size:14px">
    ${row("Name", f.name)}${row("Email", f.email)}${row("Phone", f.phone)}
    ${row("Event date", f.eventDate)}${row("Guest count", f.guests)}${row("Items", f.items.join(", "))}
    ${row("Delivery", f.address)}${row("Details", f.notes)}
  </table>
  <p style="color:#8c857a;font-size:12px;margin-top:18px">Reply to this email to reach ${esc(f.name)} directly.</p>
</div>`;
}

function pageHtml(title: string, inner: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} · Unfolded Events</title><style>body{margin:0;background:#14110d;color:#f4f1ea;font-family:Inter,Arial,sans-serif;display:grid;place-items:center;min-height:100vh;padding:2rem;text-align:center}a{color:#d8b878}h1{font-family:Georgia,serif;font-weight:400}</style></head><body><main><h1>${esc(title)}</h1>${inner}</main></body></html>`;
}

function wantsJson(event: H3Event): boolean {
  return (
    !!getHeader(event, "x-requested-with") ||
    (getHeader(event, "accept") || "").includes("application/json")
  );
}
function success(event: H3Event) {
  if (wantsJson(event)) return { ok: true };
  return sendRedirect(event, "/thank-you", 303);
}
function failure(event: H3Event) {
  setResponseStatus(event, 502);
  if (wantsJson(event)) return { ok: false, error: GENERIC_ERROR };
  setResponseHeader(event, "content-type", "text/html; charset=utf-8");
  return pageHtml("Something went wrong", `<p>${esc(GENERIC_ERROR)}</p><p><a href="/#quote">← Back to the form</a></p>`);
}

export default defineEventHandler(async (event) => {
  // Parse body — JSON (fetch) or urlencoded (native form, items[] via getAll).
  const contentType = getHeader(event, "content-type") || "";
  let raw: Record<string, unknown> = {};
  let items: string[] = [];
  if (contentType.includes("application/json")) {
    raw = (await readBody(event)) || {};
    items = Array.isArray(raw.items) ? (raw.items as unknown[]).map(str) : [];
  } else {
    const params = new URLSearchParams((await readRawBody(event)) || "");
    raw = Object.fromEntries(params);
    items = params.getAll("items");
  }

  const f: QuoteFields = {
    eventDate: str(raw.eventDate),
    guests: str(raw.guests),
    items,
    address: str(raw.address),
    name: str(raw.name),
    email: str(raw.email),
    phone: str(raw.phone),
    notes: str(raw.notes),
    company_url: str(raw.company_url),
    form_ts: str(raw.form_ts),
  };

  // ── Spam guards — silent fake success so bots get no signal, no email sent ──
  if (f.company_url.trim()) return success(event); // honeypot filled
  const ts = parseInt(f.form_ts, 10);
  if (!isNaN(ts) && Date.now() - ts < MIN_FILL_MS) return success(event); // too fast
  // TODO(rate-limit): a KV/Upstash-backed limiter or a CAPTCHA could go here
  // (e.g. N submissions per IP per hour) — intentionally omitted for now.

  // ── Server-side validation (never trust the client) ──
  const errors = validate(f);
  if (Object.keys(errors).length) {
    setResponseStatus(event, 422);
    if (wantsJson(event)) return { ok: false, errors };
    setResponseHeader(event, "content-type", "text/html; charset=utf-8");
    const list = Object.values(errors).map((m) => `<li>${esc(m)}</li>`).join("");
    return pageHtml("Please check your request", `<p>Please fix the following:</p><ul style="text-align:left;display:inline-block">${list}</ul><p><a href="/#quote">← Back to the form</a></p>`);
  }

  // ── Send via Resend (read the key from PRIVATE runtimeConfig only) ──
  const config = useRuntimeConfig(event);
  if (!config.resendApiKey || !config.quoteToEmail || !config.quoteFromEmail) {
    console.error("[quote] missing env: RESEND_API_KEY / QUOTE_TO_EMAIL / QUOTE_FROM_EMAIL");
    return failure(event);
  }
  try {
    const resend = new Resend(config.resendApiKey as string);
    const { error } = await resend.emails.send({
      from: config.quoteFromEmail as string,
      to: config.quoteToEmail as string,
      replyTo: f.email,
      subject: `New quote request — ${f.name} · ${f.eventDate}`,
      text: textBody(f),
      html: htmlBody(f),
    });
    if (error) {
      console.error("[quote] Resend error:", error);
      return failure(event);
    }
  } catch (err) {
    console.error("[quote] send failed:", err);
    return failure(event);
  }

  return success(event);
});
