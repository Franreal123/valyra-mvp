import { describe, it, expect } from "vitest";
import { formatEUR, formatEURPrecise } from "@/lib/format";

describe("formatEUR", () => {
  it("formats whole euros with dot thousands separators", () => {
    expect(formatEUR(42500)).toBe("€42.500");
    expect(formatEUR(500000)).toBe("€500.000");
  });
});

describe("formatEURPrecise", () => {
  it("formats with two decimals and a comma decimal separator", () => {
    expect(formatEURPrecise(4.25)).toBe("€4,25");
    expect(formatEURPrecise(4250.5)).toBe("€4.250,50");
  });
});
