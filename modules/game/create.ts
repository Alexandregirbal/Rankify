import { getDatabaseClient } from "@/database/db";
import { Player, TeamScoring } from "../elo/types";

const playerToMinimalPlayer = (
  player: Player
): Pick<Player, "name" | "rating" | "games"> => ({
  name: player.name,
  rating: player.rating,
  games: player.games,
});

export const createGame = async ({
  team1,
  team2,
}: {
  team1: TeamScoring;
  team2: TeamScoring;
}) => {
  const db = getDatabaseClient();

  const newGame = await db.collection("games").insertOne({
    team1: team1.players.map(playerToMinimalPlayer),
    team2: team2.players.map(playerToMinimalPlayer),
    scores: [team1.score, team2.score],
    winner: team1.score > team2.score ? "1" : "2",
    createdAt: new Date(),
  });

  return newGame;
};
