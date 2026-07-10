import { describe, expect, it } from "vitest";
import { emailCta, emailLayout, emailParagraph } from "./layout";

describe("emailLayout", () => {
  it("wraps body content with branding header and footer", () => {
    const html = emailLayout({ body: "<p>Test</p>" });
    expect(html).toContain("Tellus · UNBLCK");
    expect(html).toContain("<p>Test</p>");
    expect(html).toContain("El equipo de UNBLCK");
  });

  it("includes preheader when provided", () => {
    const html = emailLayout({ body: "<p>Test</p>", preheader: "Preview text" });
    expect(html).toContain("Preview text");
  });

  it("emailCta uses black pill styling", () => {
    const cta = emailCta("https://example.com", "Click me");
    expect(cta).toContain('background:#000');
    expect(cta).toContain('color:#E1E0CC');
    expect(cta).toContain("Click me");
  });

  it("emailParagraph returns styled paragraph", () => {
    expect(emailParagraph("Hello")).toContain("Hello");
    expect(emailParagraph("Hello")).toContain("font-size:16px");
  });
});
