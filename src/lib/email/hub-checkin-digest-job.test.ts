import { describe, expect, it, vi } from "vitest";
import {
  isAuthorizedCronRequest,
  runHubCheckinDigestJob,
} from "./hub-checkin-digest-job";
import type { HubCheckinDigestMember } from "./send-hub-checkin-digest";

function makeRequest(authHeader?: string) {
  const headers = new Headers();
  if (authHeader) headers.set("authorization", authHeader);
  return new Request("https://unblck.cl/api/cron/hub-checkin-digest", {
    headers,
  });
}

describe("isAuthorizedCronRequest", () => {
  it("rejects missing or invalid bearer tokens", () => {
    process.env.CRON_SECRET = "secret-value";
    expect(isAuthorizedCronRequest(makeRequest())).toBe(false);
    expect(isAuthorizedCronRequest(makeRequest("Bearer wrong"))).toBe(false);
    expect(isAuthorizedCronRequest(makeRequest("Bearer secret-value"))).toBe(
      true,
    );
    delete process.env.CRON_SECRET;
    expect(isAuthorizedCronRequest(makeRequest("Bearer secret-value"))).toBe(
      false,
    );
  });
});

describe("runHubCheckinDigestJob", () => {
  it("returns 401 and does not send when unauthorized", async () => {
    process.env.CRON_SECRET = "secret-value";
    const sendDigest = vi.fn();
    const supabase = {
      from: vi.fn(),
    };

    const result = await runHubCheckinDigestJob(makeRequest("Bearer wrong"), {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabase: supabase as any,
      sendDigest,
    });

    expect(result).toEqual({
      ok: false,
      status: 401,
      error: "unauthorized",
    });
    expect(sendDigest).not.toHaveBeenCalled();
    expect(supabase.from).not.toHaveBeenCalled();
    delete process.env.CRON_SECRET;
  });

  it("no-ops when digest already claimed for the hub date", async () => {
    process.env.CRON_SECRET = "secret-value";
    const sendDigest = vi.fn();

    const insert = vi.fn().mockResolvedValue({
      error: { code: "23505", message: "duplicate" },
    });
    const supabase = {
      from: vi.fn((table: string) => {
        expect(table).toBe("hub_checkin_digest_sent");
        return { insert };
      }),
    };

    const result = await runHubCheckinDigestJob(
      makeRequest("Bearer secret-value"),
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        supabase: supabase as any,
        sendDigest,
        now: new Date("2026-07-29T04:01:00.000Z"),
        siteUrl: "https://unblck.cl",
      },
    );

    expect(result).toEqual({
      ok: true,
      status: 200,
      hubDate: "2026-07-29",
      outcome: "already_sent",
      memberCount: 0,
    });
    expect(sendDigest).not.toHaveBeenCalled();
    delete process.env.CRON_SECRET;
  });

  it("skips email when zero Hub Check-ins for the hub day", async () => {
    process.env.CRON_SECRET = "secret-value";
    const sendDigest = vi.fn();

    const insert = vi.fn().mockResolvedValue({ error: null });
    const selectChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
    };
    const supabase = {
      from: vi.fn((table: string) => {
        if (table === "hub_checkin_digest_sent") return { insert };
        if (table === "bookings") return selectChain;
        throw new Error(`unexpected table ${table}`);
      }),
    };

    const result = await runHubCheckinDigestJob(
      makeRequest("Bearer secret-value"),
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        supabase: supabase as any,
        sendDigest,
        now: new Date("2026-07-29T04:01:00.000Z"),
        siteUrl: "https://unblck.cl",
      },
    );

    expect(result.outcome).toBe("empty");
    expect(sendDigest).not.toHaveBeenCalled();
    delete process.env.CRON_SECRET;
  });

  it("sends digest when members exist", async () => {
    process.env.CRON_SECRET = "secret-value";
    const members: HubCheckinDigestMember[] = [
      { fullName: "Ada Lovelace", email: "ada@example.com" },
    ];
    const sendDigest = vi.fn().mockResolvedValue({
      sent: true,
      recipientCount: 1,
      memberCount: 1,
    });

    const insert = vi.fn().mockResolvedValue({ error: null });
    const selectChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [
          {
            member_profiles: {
              email: "ada@example.com",
              unblck_applications: { full_name: "Ada Lovelace" },
            },
          },
        ],
        error: null,
      }),
    };
    const supabase = {
      from: vi.fn((table: string) => {
        if (table === "hub_checkin_digest_sent") return { insert };
        if (table === "bookings") return selectChain;
        throw new Error(`unexpected table ${table}`);
      }),
    };

    const result = await runHubCheckinDigestJob(
      makeRequest("Bearer secret-value"),
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        supabase: supabase as any,
        sendDigest,
        now: new Date("2026-07-29T04:01:00.000Z"),
        siteUrl: "https://unblck.cl",
      },
    );

    expect(result).toEqual({
      ok: true,
      status: 200,
      hubDate: "2026-07-29",
      outcome: "sent",
      memberCount: 1,
    });
    expect(sendDigest).toHaveBeenCalledWith({
      hubDate: "2026-07-29",
      members,
      siteUrl: "https://unblck.cl",
    });
    delete process.env.CRON_SECRET;
  });
});
