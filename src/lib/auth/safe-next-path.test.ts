import { describe, expect, it } from "vitest";
import {
  isApplyNextPath,
  sanitizeNextPath,
} from "@/lib/auth/safe-next-path";

describe("sanitizeNextPath", () => {
  it("allows apply and member paths", () => {
    expect(sanitizeNextPath("/apply")).toBe("/apply");
    expect(sanitizeNextPath("/accelerator/apply")).toBe("/accelerator/apply");
    expect(sanitizeNextPath("/member")).toBe("/member");
  });

  it("rejects open redirects", () => {
    expect(sanitizeNextPath("//evil.com")).toBe("/member");
    expect(sanitizeNextPath("https://evil.com")).toBe("/member");
    expect(sanitizeNextPath("/unknown")).toBe("/member");
  });
});

describe("isApplyNextPath", () => {
  it("detects apply flows", () => {
    expect(isApplyNextPath("/apply")).toBe(true);
    expect(isApplyNextPath("/accelerator/apply")).toBe(true);
    expect(isApplyNextPath("/member")).toBe(false);
  });
});
