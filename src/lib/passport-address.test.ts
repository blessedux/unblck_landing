import { describe, it, expect } from "vitest";
import {
  isValidPassportAddress,
  validatePassportAddress,
} from "./passport-address";

describe("isValidPassportAddress", () => {
  const validCases = [
    {
      name: "valid Stellar public key",
      address: "GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H",
      expected: true,
    },
    {
      name: "another valid key",
      address: "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
      expected: true,
    },
  ];

  const invalidCases = [
    {
      name: "empty string",
      address: "",
      expected: false,
    },
    {
      name: "null",
      address: null as any,
      expected: false,
    },
    {
      name: "undefined",
      address: undefined as any,
      expected: false,
    },
    {
      name: "starts with S (secret key)",
      address: "SBZVMB74D4NCUXWWR7GOZQIHPC3SGEV5KPEMGFKB5GLTTDQG5UYIUPRD",
      expected: false,
    },
    {
      name: "too short",
      address: "GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOAS",
      expected: false,
    },
    {
      name: "too long",
      address: "GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2HX",
      expected: false,
    },
    {
      name: "contains lowercase",
      address: "gbrpyhil2ci3fnq4bxlfmndlfjunpu2hy3zmfshonuceoasw7qc7ox2h",
      expected: false,
    },
    {
      name: "contains invalid base32 char (0)",
      address: "GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC70X2H",
      expected: false,
    },
    {
      name: "contains invalid base32 char (1)",
      address: "GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC71X2H",
      expected: false,
    },
    {
      name: "contains invalid base32 char (8)",
      address: "GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC78X2H",
      expected: false,
    },
    {
      name: "contains special characters",
      address: "GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7-X2H",
      expected: false,
    },
  ];

  validCases.forEach(({ name, address, expected }) => {
    it(`returns ${expected} for ${name}`, () => {
      expect(isValidPassportAddress(address)).toBe(expected);
    });
  });

  invalidCases.forEach(({ name, address, expected }) => {
    it(`returns ${expected} for ${name}`, () => {
      expect(isValidPassportAddress(address)).toBe(expected);
    });
  });
});

describe("validatePassportAddress", () => {
  it("returns valid: true with no error for valid address", () => {
    const result = validatePassportAddress(
      "GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H"
    );
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("returns specific error for missing address", () => {
    const result = validatePassportAddress("");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Address is required");
  });

  it("returns specific error for wrong prefix", () => {
    const result = validatePassportAddress(
      "SBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H"
    );
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Stellar address must start with 'G'");
  });

  it("returns specific error for wrong length", () => {
    const result = validatePassportAddress("GBRPYHIL2CI3FNQ4");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("must be 56 characters");
  });

  it("returns specific error for invalid characters", () => {
    const result = validatePassportAddress(
      "GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7-X2H"
    );
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Stellar address contains invalid characters");
  });
});
