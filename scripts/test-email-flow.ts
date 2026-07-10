/**
 * Manual end-to-end test for transactional email flow.
 *
 * Sends real emails via Resend when configured. Uses Gmail plus-addressing
 * so all messages land in the same inbox.
 *
 * Usage:
 *   npm run test:email-flow
 *   TEST_RECIPIENT=inboxblessedux@gmail.com npm run test:email-flow
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { generateMagicLinkUrl } from "../src/lib/auth/generate-magic-link-url";
import { sendAcceleratorApprovalEmail } from "../src/lib/email/send-accelerator-approval-email";
import { sendHubWelcomeEmail } from "../src/lib/email/send-hub-welcome-email";
import { memberAuthCallbackUrl } from "../src/lib/site-url";

config({ path: ".env.local" });

async function resolveBaseUrl(): Promise<string> {
  const explicit = process.env.TEST_BASE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  for (const port of [3005, 3000, 3001]) {
    const base = `http://localhost:${port}`;
    try {
      const res = await fetch(`${base}/api/apply/hub`, { method: "OPTIONS" });
      if (res.status !== 404 || res.headers.get("content-type")?.includes("json")) {
        return base;
      }
      const head = await fetch(base, { method: "HEAD" });
      if (head.ok || head.status === 307 || head.status === 308) return base;
    } catch {
      // try next port
    }
  }

  return "http://localhost:3005";
}
const RECIPIENT_BASE =
  process.env.TEST_RECIPIENT?.trim().toLowerCase() ?? "inboxblessedux@gmail.com";
const RUN_ID = Date.now().toString(36);

function plusAddress(tag: string): string {
  const [local, domain] = RECIPIENT_BASE.split("@");
  if (!local || !domain) {
    throw new Error(`Invalid TEST_RECIPIENT: ${RECIPIENT_BASE}`);
  }
  return `${local}+${tag}-${RUN_ID}@${domain}`;
}

const HUB_EMAIL = plusAddress("hub");
const ACCEL_EMAIL = plusAddress("accel");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase env vars in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function assertServerUp(base: string) {
  try {
    const res = await fetch(base, { method: "HEAD" });
    if (!res.ok && res.status !== 404 && res.status !== 307 && res.status !== 308) {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch {
    console.error(`\n❌ Dev server not reachable at ${base}`);
    console.error("   Start it with: npm run dev -- -p 3005\n");
    process.exit(1);
  }
}

async function cleanupEmail(email: string) {
  const { data: app } = await supabase
    .from("unblck_applications")
    .select("id, auth_user_id")
    .eq("email", email)
    .maybeSingle();

  if (app?.auth_user_id) {
    await supabase.from("member_profiles").delete().eq("auth_user_id", app.auth_user_id);
    await supabase.auth.admin.deleteUser(app.auth_user_id);
  }

  if (app?.id) {
    await supabase.from("unblck_applications").delete().eq("id", app.id);
  }

  const { data: users } = await supabase.auth.admin.listUsers();
  const orphan = users.users.find((u) => u.email?.toLowerCase() === email);
  if (orphan) {
    await supabase.auth.admin.deleteUser(orphan.id);
  }
}

async function postJson(base: string, path: string, body: unknown) {
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string; ok?: boolean };
  return { ok: res.ok, status: res.status, data };
}

async function step(label: string, fn: () => Promise<void>) {
  process.stdout.write(`\n▶ ${label}… `);
  try {
    await fn();
    console.log("✓");
  } catch (error) {
    console.log("✗");
    throw error;
  }
}

async function main() {
  const BASE = await resolveBaseUrl();

  console.log("📧 UNBLCK email flow test");
  console.log(`   Base URL: ${BASE}`);
  console.log(`   Inbox:    ${RECIPIENT_BASE}`);
  console.log(`   Hub:      ${HUB_EMAIL}`);
  console.log(`   Accel:    ${ACCEL_EMAIL}`);

  await assertServerUp(BASE);

  await step("Cleanup prior test data", async () => {
    await cleanupEmail(HUB_EMAIL);
    await cleanupEmail(ACCEL_EMAIL);
  });

  await step("1/5 Hub apply → confirmation email", async () => {
    const { ok, status, data } = await postJson(BASE, "/api/apply/hub", {
      full_name: "Flow Test Hub",
      email: HUB_EMAIL,
      project_name: "Email Flow Test — Hub",
      location: "Santiago",
      stellar_ambassador: "yes",
      passport_username: "@flowtest",
      terms_accepted: "true",
    });
    if (!ok) throw new Error(`${status}: ${data.error ?? "hub apply failed"}`);
  });

  await wait(1500);

  await step("2/5 Accelerator apply → confirmation email", async () => {
    const { ok, status, data } = await postJson(BASE, "/api/apply/accelerator", {
      full_name: "Flow Test Accel",
      email: ACCEL_EMAIL,
      project_name: "Email Flow Test — Accel",
      project_link: "https://example.com",
      build_description: "Testing accelerator confirmation email.",
      location: "Santiago",
      stage: "Prototype/MVP",
      team_size: "Solo founder",
      funding_status: "Pre-seed / Bootstrapped",
      motivation: "Manual email flow verification.",
      passport_username: "@flowaccel",
      terms_accepted: "true",
    });
    if (!ok) throw new Error(`${status}: ${data.error ?? "accel apply failed"}`);
  });

  await wait(1500);

  await step("3/5 Magic link request → Spanish login email", async () => {
    const { ok, status, data } = await postJson(BASE, "/api/auth/magic-link", {
      email: HUB_EMAIL,
    });
    if (!ok) throw new Error(`${status}: ${data.error ?? "magic link failed"}`);
  });

  await wait(1500);

  await step("4/5 Hub approval → welcome email + Triana discount", async () => {
    const { data: app, error } = await supabase
      .from("unblck_applications")
      .select("id, email, full_name, auth_user_id, application_type, status")
      .eq("email", HUB_EMAIL)
      .single();

    if (error || !app) throw new Error("Hub application not found");

    const magicLink = await generateMagicLinkUrl(
      app.email,
      memberAuthCallbackUrl(),
    );

    await sendHubWelcomeEmail({
      to: app.email,
      fullName: app.full_name,
      magicLink,
    });

    await supabase
      .from("unblck_applications")
      .update({ status: "approved" })
      .eq("id", app.id);

    if (app.auth_user_id) {
      await supabase.from("member_profiles").upsert(
        {
          auth_user_id: app.auth_user_id,
          application_id: app.id,
          email: app.email,
        },
        { onConflict: "auth_user_id" },
      );
    }
  });

  await wait(1500);

  await step("5/5 Accelerator approval → congratulations email", async () => {
    const { data: app, error } = await supabase
      .from("unblck_applications")
      .select("id, email, full_name")
      .eq("email", ACCEL_EMAIL)
      .single();

    if (error || !app) throw new Error("Accelerator application not found");

    await sendAcceleratorApprovalEmail({
      to: app.email,
      fullName: app.full_name,
    });

    await supabase
      .from("unblck_applications")
      .update({ status: "approved" })
      .eq("id", app.id);
  });

  console.log("\n✅ Flow complete — check your inbox for 5 emails:\n");
  console.log("   1. Recibimos tu postulación al Hub");
  console.log("   2. Recibimos tu postulación al Acelerador");
  console.log("   3. Tu enlace de acceso a UNBLCK");
  console.log("   4. Bienvenido al Tellus Hub (+ Triana discount)");
  console.log("   5. Felicitaciones — Aceptado al Acelerador UNBLCK");
  console.log(`\n   Delivered to: ${RECIPIENT_BASE} (plus-addressed)\n`);
}

main().catch((error) => {
  console.error("\n❌ Test failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
