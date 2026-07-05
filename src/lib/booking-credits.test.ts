import { describe, it, expect } from "vitest";
import { canBook, getWeeklyCredits } from "./booking-credits";

describe("canBook", () => {
  const baseContext = {
    tier: "ambassador" as const,
    now: new Date("2026-07-08T10:00:00Z"), // Wednesday, July 8, 2026
    existingBookings: [],
    openDays: [1, 2, 3, 4, 5], // Mon-Fri
  };

  describe("same-day booking", () => {
    it("rejects same-day booking", () => {
      const result = canBook({
        ...baseContext,
        targetDate: new Date("2026-07-08T15:00:00Z"), // Same day, different time
      });

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("same day");
      expect(result.creditsRemaining).toBe(3);
    });
  });

  describe("past dates", () => {
    it("rejects booking in the past", () => {
      const result = canBook({
        ...baseContext,
        targetDate: new Date("2026-07-07T10:00:00Z"), // Yesterday
      });

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("past");
    });
  });

  describe("closed days", () => {
    it("rejects booking on closed day (Sunday)", () => {
      const result = canBook({
        ...baseContext,
        targetDate: new Date("2026-07-19T10:00:00Z"), // Sunday
      });

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("closed");
    });

    it("rejects booking on closed day (Saturday)", () => {
      const result = canBook({
        ...baseContext,
        targetDate: new Date("2026-07-18T10:00:00Z"), // Saturday
      });

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("closed");
    });
  });

  describe("double-booking", () => {
    it("rejects double-booking on same date", () => {
      const result = canBook({
        ...baseContext,
        targetDate: new Date("2026-07-09T10:00:00Z"), // Thursday
        existingBookings: [
          new Date("2026-07-09T14:00:00Z"), // Same day, different time
        ],
      });

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("already have a booking");
    });
  });

  describe("ambassador credits", () => {
    it("allows first booking of the week", () => {
      const result = canBook({
        ...baseContext,
        targetDate: new Date("2026-07-09T10:00:00Z"), // Thursday, next day
      });

      expect(result.allowed).toBe(true);
      expect(result.creditsRemaining).toBe(2); // 3 - 1
    });

    it("allows second booking of the week", () => {
      const result = canBook({
        ...baseContext,
        targetDate: new Date("2026-07-10T10:00:00Z"), // Friday
        existingBookings: [
          new Date("2026-07-09T10:00:00Z"), // Thursday
        ],
      });

      expect(result.allowed).toBe(true);
      expect(result.creditsRemaining).toBe(1);
    });

    it("allows third booking of the week", () => {
      const result = canBook({
        ...baseContext,
        targetDate: new Date("2026-07-10T10:00:00Z"), // Friday
        existingBookings: [
          new Date("2026-07-06T10:00:00Z"), // Monday this week
          new Date("2026-07-07T10:00:00Z"), // Tuesday this week
        ],
      });

      expect(result.allowed).toBe(true);
      expect(result.creditsRemaining).toBe(0);
    });

    it("rejects fourth booking in same week", () => {
      const result = canBook({
        ...baseContext,
        targetDate: new Date("2026-07-10T10:00:00Z"), // Friday
        existingBookings: [
          new Date("2026-07-06T10:00:00Z"), // Monday
          new Date("2026-07-07T10:00:00Z"), // Tuesday
          new Date("2026-07-09T10:00:00Z"), // Thursday
        ],
      });

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("used all 3 credits");
      expect(result.creditsRemaining).toBe(0);
    });

    it("allows booking in new week after using 3 credits previous week", () => {
      const result = canBook({
        ...baseContext,
        now: new Date("2026-07-13T10:00:00Z"), // Monday, next week
        targetDate: new Date("2026-07-14T10:00:00Z"), // Tuesday, next week
        existingBookings: [
          // Previous week (Mon July 6 - Sun July 12)
          new Date("2026-07-06T10:00:00Z"), // Monday
          new Date("2026-07-07T10:00:00Z"), // Tuesday
          new Date("2026-07-09T10:00:00Z"), // Thursday
        ],
      });

      expect(result.allowed).toBe(true);
      expect(result.creditsRemaining).toBe(2);
    });
  });

  describe("stellar_funded tier", () => {
    const stellarContext = {
      ...baseContext,
      tier: "stellar_funded" as const,
    };

    it("allows booking even with many existing bookings", () => {
      const result = canBook({
        ...stellarContext,
        targetDate: new Date("2026-07-09T10:00:00Z"),
        existingBookings: [
          new Date("2026-07-06T10:00:00Z"),
          new Date("2026-07-07T10:00:00Z"),
          new Date("2026-07-10T10:00:00Z"),
        ],
      });

      expect(result.allowed).toBe(true);
      expect(result.creditsRemaining).toBe(Infinity);
    });

    it("still respects same-day rule", () => {
      const result = canBook({
        ...stellarContext,
        targetDate: new Date("2026-07-08T15:00:00Z"),
      });

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("same day");
    });

    it("still respects closed days", () => {
      const result = canBook({
        ...stellarContext,
        targetDate: new Date("2026-07-19T10:00:00Z"), // Sunday
      });

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("closed");
    });

    it("still respects double-booking", () => {
      const result = canBook({
        ...stellarContext,
        targetDate: new Date("2026-07-09T10:00:00Z"),
        existingBookings: [new Date("2026-07-09T10:00:00Z")],
      });

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("already have a booking");
    });
  });

  describe("week boundary", () => {
    it("correctly handles Sunday as last day of week", () => {
      // Week starts Monday July 6, ends Sunday July 12
      const result = canBook({
        ...baseContext,
        now: new Date("2026-07-08T10:00:00Z"), // Wednesday
        targetDate: new Date("2026-07-13T10:00:00Z"), // Monday next week
        existingBookings: [
          new Date("2026-07-06T10:00:00Z"), // Monday this week
          new Date("2026-07-07T10:00:00Z"), // Tuesday this week
          new Date("2026-07-09T10:00:00Z"), // Thursday this week
        ],
      });

      // Should allow because it's a new week
      expect(result.allowed).toBe(true);
      expect(result.creditsRemaining).toBe(2);
    });
  });
});

describe("getWeeklyCredits", () => {
  const now = new Date("2026-07-08T10:00:00Z"); // Wednesday

  it("returns correct status for ambassador with no bookings", () => {
    const result = getWeeklyCredits("ambassador", now, []);

    expect(result.total).toBe(3);
    expect(result.used).toBe(0);
    expect(result.remaining).toBe(3);
  });

  it("returns correct status for ambassador with 2 bookings this week", () => {
    const result = getWeeklyCredits("ambassador", now, [
      new Date("2026-07-06T10:00:00Z"), // Monday
      new Date("2026-07-07T10:00:00Z"), // Tuesday
    ]);

    expect(result.total).toBe(3);
    expect(result.used).toBe(2);
    expect(result.remaining).toBe(1);
  });

  it("does not count bookings from previous week", () => {
    const result = getWeeklyCredits("ambassador", now, [
      new Date("2026-06-30T10:00:00Z"), // Previous week
      new Date("2026-07-06T10:00:00Z"), // This week Monday
    ]);

    expect(result.used).toBe(1);
    expect(result.remaining).toBe(2);
  });

  it("returns infinity for stellar_funded", () => {
    const result = getWeeklyCredits("stellar_funded", now, [
      new Date("2026-07-06T10:00:00Z"),
      new Date("2026-07-07T10:00:00Z"),
      new Date("2026-07-08T10:00:00Z"),
    ]);

    expect(result.total).toBe(Infinity);
    expect(result.used).toBe(0);
    expect(result.remaining).toBe(Infinity);
  });
});
