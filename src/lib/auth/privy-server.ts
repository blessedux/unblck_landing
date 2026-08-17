import { PrivyClient, type User } from "@privy-io/server-auth";
import { normalizeEmail } from "@/lib/forms/validate-email";

export function getPrivyServerClient(): PrivyClient {
  const appId =
    process.env.NEXT_PUBLIC_PRIVY_APP_ID?.trim() ||
    process.env.PRIVY_APP_ID?.trim();
  const secret = process.env.PRIVY_APP_SECRET?.trim();
  if (!appId || !secret) {
    throw new Error("Privy is not configured");
  }
  return new PrivyClient(appId, secret);
}

export function emailFromPrivyUser(user: User): string | null {
  const fromEmail = user.email?.address;
  const fromGoogle = user.google?.email;
  const fromLinked = user.linkedAccounts?.find(
    (account) =>
      (account.type === "email" && "address" in account && account.address) ||
      (account.type === "google_oauth" && "email" in account && account.email),
  );
  const linkedEmail =
    fromLinked && "address" in fromLinked
      ? fromLinked.address
      : fromLinked && "email" in fromLinked
        ? fromLinked.email
        : null;

  const raw = fromEmail || fromGoogle || linkedEmail;
  if (!raw || typeof raw !== "string") return null;
  return normalizeEmail(raw);
}

export function displayNameFromPrivyUser(user: User): string | null {
  const googleName = user.google?.name?.trim();
  if (googleName) return googleName;

  for (const account of user.linkedAccounts ?? []) {
    if (
      account.type === "google_oauth" &&
      "name" in account &&
      typeof account.name === "string" &&
      account.name.trim()
    ) {
      return account.name.trim();
    }
  }

  return null;
}
