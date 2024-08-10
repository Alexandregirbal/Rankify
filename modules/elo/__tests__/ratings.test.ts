import { describe, expect, it } from "vitest";
import { calculatePlayerRating, calculatePlayersRatings } from "../ratings";

describe("Testing the ratings part of the elo module", () => {
  it("should return a coherent rating", () => {
    const originRating = 1000;
    const result = calculatePlayerRating(
      { rating: originRating, games: 0, name: "player1" },
      [
        { rating: 1000, games: 0, name: "player2" },
        { rating: 1500, games: 0, name: "player3" },
      ],
      [8, 7]
    );

    expect(result.rating).toBeGreaterThan(originRating);

    const result2 = calculatePlayerRating(
      { rating: originRating, games: 0, name: "player1" },
      [
        { rating: 1000, games: 0, name: "player2" },
        { rating: 1500, games: 0, name: "player3" },
      ],
      [0, 1]
    );

    expect(result2.rating).toBeLessThan(originRating);
  });

  it("should return a coherent rating for each player", () => {
    const originRating1 = 1000;
    const originRating2 = 1200;
    const originRating3 = 900;
    const originRating4 = 1500;
    const result = calculatePlayersRatings(
      [
        { rating: originRating1, games: 0, name: "player1" },
        { rating: originRating2, games: 10, name: "player2" },
      ],
      [
        { rating: originRating3, games: 8, name: "player3" },
        { rating: originRating4, games: 100, name: "player4" },
      ],
      [8, 7]
    );

    expect(result[0].rating).toBeGreaterThan(originRating1);
    expect(result[1].rating).toBeGreaterThan(originRating2);
    expect(result[2].rating).toBeLessThan(originRating3);
    expect(result[3].rating).toBeLessThan(originRating4);
  });
});
