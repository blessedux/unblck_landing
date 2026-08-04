import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.fn();

vi.mock("@/lib/email/resend-config", () => ({
  getResendClient: () => ({ emails: { send: sendMock } }),
  getResendFromAddress: () => "UNBLCK <noreply@tellus.foundation>",
  shouldSkipResendInDev: () => false,
  isResendConfigured: () => true,
}));

import {
  buildHubCheckinAdminAlertContent,
  sendHubCheckinAdminAlert,
} from "./send-hub-checkin-admin-alert";

describe("buildHubCheckinAdminAlertContent", () => {
  it("builds English subject with name, email, date, and admin CTA", () => {
    const content = buildHubCheckinAdminAlertContent({
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      bookingDate: "2026-08-05",
      siteUrl: "https://unblck.cl",
    });

    expect(content.subject).toBe(
      "New Hub Check-in — Ada Lovelace (2026-08-05)",
    );
    expect(content.text).toContain("Name: Ada Lovelace");
    expect(content.text).toContain("Email: ada@example.com");
    expect(content.text).toContain("Date: 2026-08-05");
    expect(content.adminUrl).toBe("https://unblck.cl/admin");
    expect(content.html).toContain("https://unblck.cl/admin");
  });

  it("falls back to email when name is missing", () => {
    const content = buildHubCheckinAdminAlertContent({
      email: "anon@example.com",
      bookingDate: "2026-08-05",
      siteUrl: "https://unblck.cl",
    });

    expect(content.subject).toContain("anon@example.com");
    expect(content.text).toContain("Name: anon@example.com");
  });
});

describe("sendHubCheckinAdminAlert", () => {
  beforeEach(() => {
    sendMock.mockReset();
    sendMock.mockResolvedValue({ error: null });
    process.env.ADMIN_EMAILS = "ops@unblck.com, second@unblck.com";
  });

  afterEach(() => {
    delete process.env.ADMIN_EMAILS;
  });

  it("sends one Resend email to all ADMIN_EMAILS", async () => {
    await sendHubCheckinAdminAlert({
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      bookingDate: "2026-08-05",
      siteUrl: "https://unblck.cl",
    });

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ["ops@unblck.com", "second@unblck.com"],
        subject: "New Hub Check-in — Ada Lovelace (2026-08-05)",
      }),
    );
  });

  it("skips send when ADMIN_EMAILS is empty", async () => {
    process.env.ADMIN_EMAILS = "";
    await sendHubCheckinAdminAlert({
      email: "ada@example.com",
      bookingDate: "2026-08-05",
      siteUrl: "https://unblck.cl",
    });
    expect(sendMock).not.toHaveBeenCalled();
  });
});
