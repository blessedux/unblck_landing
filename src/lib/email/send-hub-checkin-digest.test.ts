import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.fn();

vi.mock("@/lib/email/resend-config", () => ({
  getResendClient: () => ({ emails: { send: sendMock } }),
  getResendFromAddress: () => "UNBLCK <noreply@tellus.foundation>",
  shouldSkipResendInDev: () => false,
  isResendConfigured: () => true,
}));

import {
  buildHubCheckinDigestContent,
  sendHubCheckinDigest,
} from "./send-hub-checkin-digest";

describe("buildHubCheckinDigestContent", () => {
  it("includes hub date, count, member rows, and /admin CTA", () => {
    const content = buildHubCheckinDigestContent({
      hubDate: "2026-07-29",
      members: [
        { fullName: "Ada Lovelace", email: "ada@example.com" },
        { fullName: "Grace Hopper", email: "grace@example.com" },
      ],
      siteUrl: "https://unblck.cl",
    });

    expect(content.subject).toBe("Hub Check-ins for 2026-07-29 (2)");
    expect(content.text).toContain("2 Hub Check-ins for 2026-07-29");
    expect(content.text).toContain("Ada Lovelace — ada@example.com");
    expect(content.text).toContain("Grace Hopper — grace@example.com");
    expect(content.adminUrl).toBe("https://unblck.cl/admin");
    expect(content.html).toContain("https://unblck.cl/admin");
  });
});

describe("sendHubCheckinDigest", () => {
  beforeEach(() => {
    sendMock.mockReset();
    sendMock.mockResolvedValue({ error: null });
    process.env.ADMIN_EMAILS = "ops@unblck.com, second@unblck.com";
  });

  afterEach(() => {
    delete process.env.ADMIN_EMAILS;
  });

  it("skips Resend when there are no Hub Check-ins", async () => {
    const result = await sendHubCheckinDigest({
      hubDate: "2026-07-29",
      members: [],
      siteUrl: "https://unblck.cl",
    });
    expect(result).toEqual({ sent: false, reason: "empty" });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("sends one English digest to all ADMIN_EMAILS", async () => {
    const result = await sendHubCheckinDigest({
      hubDate: "2026-07-29",
      members: [{ fullName: "Ada Lovelace", email: "ada@example.com" }],
      siteUrl: "https://unblck.cl",
    });

    expect(result).toEqual({
      sent: true,
      recipientCount: 2,
      memberCount: 1,
    });
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ["ops@unblck.com", "second@unblck.com"],
        subject: "Hub Check-ins for 2026-07-29 (1)",
      }),
    );
    const payload = sendMock.mock.calls[0][0];
    expect(payload.text).toContain("Ada Lovelace — ada@example.com");
    expect(payload.html).toContain("/admin");
  });
});
