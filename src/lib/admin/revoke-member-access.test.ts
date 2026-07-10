import { describe, expect, it } from "vitest";
import { isValidStatusTransition } from "./revoke-member-access";

describe("isValidStatusTransition", () => {
  it("allows pending to approved or rejected", () => {
    expect(isValidStatusTransition("pending", "approved")).toBe(true);
    expect(isValidStatusTransition("pending", "rejected")).toBe(true);
  });

  it("allows approved to rejected (revocation)", () => {
    expect(isValidStatusTransition("approved", "rejected")).toBe(true);
  });

  it("allows rejected to approved (re-approval)", () => {
    expect(isValidStatusTransition("rejected", "approved")).toBe(true);
  });

  it("blocks invalid transitions", () => {
    expect(isValidStatusTransition("approved", "pending")).toBe(false);
    expect(isValidStatusTransition("rejected", "pending")).toBe(false);
    expect(isValidStatusTransition("pending", "pending")).toBe(true);
  });
});
