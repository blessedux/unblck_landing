/**
 * Sync Supabase auth users for every address in ADMIN_EMAILS.
 *
 * Required env vars:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - ADMIN_EMAILS
 * - ADMIN_PASSWORD
 *
 * Run locally against prod Supabase whenever admins or password change:
 *   npm run seed:admin
 */

import { config } from "dotenv";
import { createClient, type User } from "@supabase/supabase-js";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminPassword = process.env.ADMIN_PASSWORD;
const adminEmails =
  process.env.ADMIN_EMAILS?.split(",").map((email) =>
    email.trim().toLowerCase(),
  ).filter(Boolean) ?? [];

function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
}

requireEnv(supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL");
requireEnv(supabaseServiceRoleKey, "SUPABASE_SERVICE_ROLE_KEY");
requireEnv(adminPassword, "ADMIN_PASSWORD");

if (adminEmails.length === 0) {
  console.error("ADMIN_EMAILS must list at least one admin email.");
  process.exit(1);
}

if (adminPassword!.length < 8) {
  console.error("ADMIN_PASSWORD must be at least 8 characters.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function findUserByEmail(email: string): Promise<User | null> {
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    });

    if (error) throw error;

    const user = data.users.find((candidate) => candidate.email === email);
    if (user) return user;
    if (data.users.length < 1000) return null;

    page += 1;
  }
}

async function syncAdmin(email: string) {
  console.log(`\nSyncing admin: ${email}`);

  const existingUser = await findUserByEmail(email);

  const { data: authData, error: authError } = existingUser
    ? await supabase.auth.admin.updateUserById(existingUser.id, {
        password: adminPassword,
        email_confirm: true,
        user_metadata: { role: "admin" },
      })
    : await supabase.auth.admin.createUser({
        email,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { role: "admin" },
      });

  if (authError || !authData.user) {
    throw authError ?? new Error("No auth user returned");
  }

  const authUser = authData.user;
  console.log(`  Auth user ready: ${authUser.id}`);

  const { data: existingApplication, error: applicationLookupError } =
    await supabase
      .from("unblck_applications")
      .select("id")
      .eq("email", email)
      .maybeSingle();

  if (applicationLookupError) throw applicationLookupError;

  const applicationPayload = {
    full_name: "UNBLCK Admin",
    email,
    project_name: "UNBLCK Admin",
    project_link: "https://unblck.org",
    build_description: "Administrative account",
    location: "Santiago, Chile",
    stage: "internal",
    motivation: "Admin access",
    passport_address: "unblck_admin",
    application_type: "hub_access",
    status: "approved",
    auth_user_id: authUser.id,
    passport_verified: true,
    stellar_funded: true,
    terms_version: process.env.TERMS_VERSION || "2026-07-01",
    terms_accepted_at: new Date().toISOString(),
  };

  const { data: application, error: applicationError } = existingApplication
    ? await supabase
        .from("unblck_applications")
        .update(applicationPayload)
        .eq("id", existingApplication.id)
        .select("id")
        .single()
    : await supabase
        .from("unblck_applications")
        .insert(applicationPayload)
        .select("id")
        .single();

  if (applicationError || !application) {
    throw applicationError ?? new Error("No application returned");
  }

  console.log(`  Application ready: ${application.id}`);

  const { error: profileError } = await supabase.from("member_profiles").upsert(
    {
      auth_user_id: authUser.id,
      application_id: application.id,
      email,
      stellar_funded: true,
      passport_verified: true,
    },
    { onConflict: "auth_user_id" },
  );

  if (profileError) throw profileError;

  console.log("  Member profile ready.");
}

async function seedAdmins() {
  console.log(`Syncing ${adminEmails.length} admin(s) from ADMIN_EMAILS...`);

  for (const email of adminEmails) {
    await syncAdmin(email);
  }

  console.log("\nDone. Admins can log in at /login with password (no magic link).");
}

seedAdmins().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
