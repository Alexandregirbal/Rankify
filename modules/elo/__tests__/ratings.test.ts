import { describe, expect, it } from "vitest";
import { calculatePlayersRatings } from "../ratings";

describe("Testing the ratings part of the elo module", () => {
  it("should reward with positive points for a victory, and negative points for a loss", () => {
    const player1 = {
      rating: 1000,
      games: 0,
      name: "player1",
      ratingHistory: [],
    };
    const player2 = {
      rating: 1200,
      games: 10,
      name: "player2",
      ratingHistory: [],
    };
    const player3 = {
      rating: 900,
      games: 8,
      name: "player3",
      ratingHistory: [],
    };
    const player4 = {
      rating: 1500,
      games: 100,
      name: "player4",
      ratingHistory: [],
    };

    const result = calculatePlayersRatings(
      {
        players: [player1, player2],
        score: 8,
      },
      {
        players: [player3, player4],
        score: 7,
      }
    );

    expect(result[0].rating).toBeGreaterThan(player1.rating);
    expect(result[1].rating).toBeGreaterThan(player2.rating);
    expect(result[2].rating).toBeLessThan(player3.rating);
    expect(result[3].rating).toBeLessThan(player4.rating);
  });

  it("Should should reward the same amount of points for all players (with same number of games)", () => {
    const player1 = {
      rating: 1000,
      games: 100,
      name: "player1",
      ratingHistory: [],
    };
    const player2 = {
      rating: 2000,
      games: 100,
      name: "player2",
      ratingHistory: [],
    };
    const player3 = {
      rating: 900,
      games: 100,
      name: "player3",
      ratingHistory: [],
    };
    const player4 = {
      rating: 1300,
      games: 100,
      name: "player4",
      ratingHistory: [],
    };

    const resultTeam1Wins = calculatePlayersRatings(
      {
        players: [player1, player2],
        score: 8,
      },
      {
        players: [player3, player4],
        score: 7,
      }
    );
    const resultTeam2Wins = calculatePlayersRatings(
      {
        players: [player1, player2],
        score: 7,
      },
      {
        players: [player3, player4],
        score: 8,
      }
    );

    const deltaPlayer1Win = resultTeam1Wins[0].rating - player1.rating;
    const deltaPlayer2Win = resultTeam1Wins[1].rating - player2.rating;
    const deltaPlayer3Loss = resultTeam1Wins[2].rating - player3.rating;
    const deltaPlayer4Loss = resultTeam1Wins[3].rating - player4.rating;

    expect(deltaPlayer1Win.toFixed(2)).toBe(deltaPlayer2Win.toFixed(2));
    expect(deltaPlayer3Loss.toFixed(2)).toBe(deltaPlayer4Loss.toFixed(2));
    expect(deltaPlayer1Win.toFixed(2)).toBe((-deltaPlayer3Loss).toFixed(2));

    const deltaPlayer1Loss = resultTeam2Wins[0].rating - player1.rating;
    expect(Math.abs(deltaPlayer1Loss)).toBeGreaterThan(
      Math.abs(deltaPlayer1Win)
    );
  });
});
