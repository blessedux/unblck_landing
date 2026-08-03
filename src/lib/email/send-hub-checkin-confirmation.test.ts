import { beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.fn();

vi.mock("@/lib/email/resend-config", () => ({
  getResendClient: () => ({ emails: { send: sendMock } }),
  getResendFromAddress: () => "UNBLCK <noreply@tellus.foundation>",
  shouldSkipResendInDev: () => false,
  isResendConfigured: () => true,
}));

import {
  buildHubCheckinConfirmationContent,
  formatHubCheckinDateLabel,
  sendHubCheckinConfirmation,
} from "./send-hub-checkin-confirmation";

describe("formatHubCheckinDateLabel", () => {
  it("formats YYYY-MM-DD in Spanish Chile locale", () => {
    const label = formatHubCheckinDateLabel("2026-08-05");
    expect(label.toLowerCase()).toContain("agosto");
    expect(label).toContain("2026");
    expect(label).toContain("5");
  });
});

describe("buildHubCheckinConfirmationContent", () => {
  it("builds Spanish confirmation with date and member CTA", () => {
    const content = buildHubCheckinConfirmationContent({
      to: "ada@example.com",
      fullName: "Ada Lovelace",
      bookingDate: "2026-08-05",
      siteUrl: "https://unblck.cl",
    });

    expect(content.subject).toContain("Confirmación de reserva");
    expect(content.text).toContain("Hola Ada Lovelace");
    expect(content.text).toContain("Hub Check-in");
    expect(content.memberUrl).toBe("https://unblck.cl/member");
    expect(content.html).toContain("https://unblck.cl/member");
    expect(content.html).toContain("Hub Check-in");
  });

  it("falls back to generic greeting without a name", () => {
    const content = buildHubCheckinConfirmationContent({
      to: "anon@example.com",
      bookingDate: "2026-08-05",
      siteUrl: "https://unblck.cl",
    });

    expect(content.text.startsWith("Hola,")).toBe(true);
    expect(content.text).not.toContain("Hola null");
  });
});

describe("sendHubCheckinConfirmation", () => {
  beforeEach(() => {
    sendMock.mockReset();
    sendMock.mockResolvedValue({ error: null });
  });

  it("sends one Resend email to the member", async () => {
    await sendHubCheckinConfirmation({
      to: "ada@example.com",
      fullName: "Ada Lovelace",
      bookingDate: "2026-08-05",
      siteUrl: "https://unblck.cl",
    });

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "UNBLCK <noreply@tellus.foundation>",
        to: ["ada@example.com"],
        subject: expect.stringContaining("Confirmación de reserva"),
      }),
    );
  });
});
