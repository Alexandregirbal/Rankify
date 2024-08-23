import { describe, expect, it } from "vitest";
import {
  calculateExpectation,
  calculateTeamsExpectations,
} from "../expectations";

describe("Testing the expectations part of the elo module", () => {
  it("should return a coherent expectation between two ratings", () => {
    expect(calculateExpectation(1000, 1000)).toBe(0.5);
    const result = calculateExpectation(1000, 600);
    expect(result).toBeGreaterThanOrEqual(0.9);
    expect(result).toBeLessThanOrEqual(0.91);
  });

  it("should return a coherent expectation between two teams of 1 player", () => {
    const result = calculateTeamsExpectations(
      [{ rating: 1000, games: 0, name: "player1", ratingHistory: [] }],
      [{ rating: 1000, games: 0, name: "player2", ratingHistory: [] }]
    );

    expect(result).toEqual({ team1: 0.5, team2: 0.5 });

    const result2 = calculateTeamsExpectations(
      [{ rating: 1000, games: 0, name: "player1", ratingHistory: [] }],
      [{ rating: 600, games: 1, name: "player2", ratingHistory: [] }]
    );

    expect(result2).toBeDefined();
    if (!result2) return;

    expect(result2.team1).toBeGreaterThanOrEqual(0.9);
    expect(result2.team1).toBeLessThanOrEqual(0.91);
    expect(result2.team2).toBeGreaterThanOrEqual(0.09);
    expect(result2.team2).toBeLessThanOrEqual(0.1);
  });

  it("should return a coherent expectation between two teams of many players", () => {
    const result = calculateTeamsExpectations(
      [
        { rating: 1200, games: 0, name: "player1", ratingHistory: [] },
        { rating: 1400, games: 0, name: "player2", ratingHistory: [] },
      ],
      [
        { rating: 1000, games: 0, name: "player5", ratingHistory: [] },
        { rating: 1500, games: 0, name: "player6", ratingHistory: [] },
        { rating: 950, games: 0, name: "player7", ratingHistory: [] },
      ]
    );

    expect(result).toBeDefined();
    if (!result) return;

    expect(result.team1).toBeGreaterThanOrEqual(result.team2);
  });
});
