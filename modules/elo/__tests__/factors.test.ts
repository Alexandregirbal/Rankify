import { describe, expect, it } from "vitest";
import { BASE_K_FACTOR } from "../constants";
import { calculateKFactor, calculatePFactor } from "../factors";

describe("Testing the factors part of the elo module", () => {
  it("should return a coherent KFactor", () => {
    const kFactor = calculateKFactor(10);
    expect(kFactor).toBeTypeOf("number");
    expect(kFactor).toBeGreaterThanOrEqual(BASE_K_FACTOR);
    expect(kFactor).toBeLessThanOrEqual(2 * BASE_K_FACTOR);
  });

  it("should return a coherent PFactor", async () => {
    expect(calculatePFactor(8, 7)).toBe(1);
    expect(calculatePFactor(8, 0)).toBe(8);
    expect(calculatePFactor(1, 0)).toBe(1);
  });
});
