import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.fn();

vi.mock("@/lib/email/resend-config", () => ({
  getResendClient: () => ({ emails: { send: sendMock } }),
  getResendFromAddress: () => "UNBLCK <noreply@tellus.foundation>",
  shouldSkipResendInDev: () => false,
  isResendConfigured: () => true,
}));

import {
  buildAdminApplicationAlertContent,
  sendAdminApplicationAlert,
} from "./send-admin-application-alert";

describe("buildAdminApplicationAlertContent", () => {
  it("builds Hub Access subject, lean body fields, and admin deep link", () => {
    const content = buildAdminApplicationAlertContent({
      applicationId: "app-123",
      applicationType: "hub_access",
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      projectName: "Analytical Engine",
      siteUrl: "https://unblck.cl",
    });

    expect(content.subject).toBe(
      "New Hub Access application — Ada Lovelace",
    );
    expect(content.text).toContain("Name: Ada Lovelace");
    expect(content.text).toContain("Email: ada@example.com");
    expect(content.text).toContain("Project: Analytical Engine");
    expect(content.adminUrl).toBe(
      "https://unblck.cl/admin/applications/app-123",
    );
    expect(content.html).toContain("Hub Access");
    expect(content.html).toContain(
      "https://unblck.cl/admin/applications/app-123",
    );
  });

  it("labels Accelerator applications correctly", () => {
    const content = buildAdminApplicationAlertContent({
      applicationId: "app-456",
      applicationType: "accelerator",
      fullName: "Grace Hopper",
      email: "grace@example.com",
      projectName: "COBOL",
      siteUrl: "https://unblck.cl",
    });

    expect(content.subject).toContain("Accelerator");
    expect(content.html).toContain("Accelerator");
  });
});

describe("sendAdminApplicationAlert", () => {
  beforeEach(() => {
    sendMock.mockReset();
    sendMock.mockResolvedValue({ error: null });
    process.env.ADMIN_EMAILS = "ops@unblck.com, second@unblck.com";
  });

  afterEach(() => {
    delete process.env.ADMIN_EMAILS;
  });

  it("sends one Resend email to all ADMIN_EMAILS", async () => {
    await sendAdminApplicationAlert({
      applicationId: "app-123",
      applicationType: "hub_access",
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      projectName: "Analytical Engine",
      siteUrl: "https://unblck.cl",
    });

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ["ops@unblck.com", "second@unblck.com"],
        subject: "New Hub Access application — Ada Lovelace",
        from: "UNBLCK <noreply@tellus.foundation>",
      }),
    );
    const payload = sendMock.mock.calls[0][0];
    expect(payload.text).toContain("ada@example.com");
    expect(payload.html).toContain("/admin/applications/app-123");
  });

  it("skips send when ADMIN_EMAILS is empty", async () => {
    process.env.ADMIN_EMAILS = "";
    await sendAdminApplicationAlert({
      applicationId: "app-123",
      applicationType: "hub_access",
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      projectName: "Analytical Engine",
      siteUrl: "https://unblck.cl",
    });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("throws when Resend returns an error", async () => {
    sendMock.mockResolvedValue({ error: { message: "boom" } });
    await expect(
      sendAdminApplicationAlert({
        applicationId: "app-123",
        applicationType: "accelerator",
        fullName: "Grace Hopper",
        email: "grace@example.com",
        projectName: "COBOL",
        siteUrl: "https://unblck.cl",
      }),
    ).rejects.toThrow("boom");
  });
});
