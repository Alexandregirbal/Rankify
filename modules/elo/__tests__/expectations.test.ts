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
      [{ rating: 1000, games: 0, name: "player1", playerId: "1" }],
      [{ rating: 1000, games: 0, name: "player2", playerId: "2" }]
    );

    expect(result).toEqual({ team1: 0.5, team2: 0.5 });

    const result2 = calculateTeamsExpectations(
      [{ rating: 1000, games: 0, name: "player3", playerId: "3" }],
      [{ rating: 600, games: 1, name: "player4", playerId: "4" }]
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
        { rating: 1200, games: 0, name: "player1", playerId: "1" },
        { rating: 1400, games: 0, name: "player2", playerId: "2" },
      ],
      [
        { rating: 1000, games: 0, name: "player3", playerId: "3" },
        { rating: 1500, games: 0, name: "player4", playerId: "4" },
        { rating: 950, games: 0, name: "player5", playerId: "5" },
      ]
    );

    expect(result).toBeDefined();
    if (!result) return;

    expect(result.team1).toBeGreaterThanOrEqual(result.team2);
  });
});
