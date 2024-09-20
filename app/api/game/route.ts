import { calculatePlayersRatings } from "@/modules/elo/ratings";
import { teamScoringSchema } from "@/modules/elo/schemas";
import { createGame } from "@/modules/game/create";
import { getPlayerGames } from "@/modules/game/get";
import { getPlayer, getPlayers } from "@/modules/player/get";
import { updatePlayerRating } from "@/modules/player/update";
import {
  upsertPlayerQuoteOfTheDay,
  upsertQuoteOfTheDay,
} from "@/modules/quote/update";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const requestBodySchema = z.object({
  team1: teamScoringSchema,
  team2: teamScoringSchema,
});

export async function POST(request: Request) {
  const requestBody = await request.json();
  const requestBodyResult = requestBodySchema.safeParse(requestBody);
  if (!requestBodyResult.success) {
    return Response.json(
      { error: requestBodyResult.error.issues[0].message },
      { status: 400 }
    );
  }

  const { team1, team2 } = requestBodyResult.data;

  revalidatePath("/", "layout"); // Revalidating all data (https://nextjs.org/docs/app/api-reference/functions/revalidatePath#revalidating-all-data)

  const [team1Players, team2Players] = await Promise.all([
    getPlayers({
      playersIds: team1.players.map((player) => player.playerId),
    }),
    getPlayers({
      playersIds: team2.players.map((player) => player.playerId),
    }),
  ]);

  const team1PlayersIds = team1Players.map((player) => player._id);
  const team2PlayersIds = team2Players.map((player) => player._id);

  const team1PlayersWithPlayerId = team1Players.map((player) => ({
    ...player,
    playerId: player._id,
  }));
  const team2PlayersWithPlayerId = team2Players.map((player) => ({
    ...player,
    playerId: player._id,
  }));

  const newPlayersRatings = calculatePlayersRatings(
    {
      ...team1,
      players: team1PlayersWithPlayerId,
    },
    {
      ...team2,
      players: team2PlayersWithPlayerId,
    }
  );

  const updatedPlayers = await Promise.all(
    newPlayersRatings.map((player) =>
      updatePlayerRating({
        playerId: player.playerId,
        newRating: player.newRating,
      })
    )
  );

  const newGame = await createGame({
    team1: {
      players: newPlayersRatings.filter((player) =>
        team1PlayersIds.includes(player.playerId)
      ),
      score: team1.score,
      eliminationFoul: team1.eliminationFoul,
    },
    team2: {
      players: newPlayersRatings.filter((player) =>
        team2PlayersIds.includes(player.playerId)
      ),
      score: team2.score,
      eliminationFoul: team2.eliminationFoul,
    },
  });

  await Promise.all([
    upsertQuoteOfTheDay(newGame),
    ...[...team1Players, ...team1Players].map((player) =>
      upsertPlayerQuoteOfTheDay(player._id, newGame)
    ),
  ]);

  return Response.json(
    { message: "Game added successfully", details: updatedPlayers },
    { status: 200 }
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const playerId = url.searchParams.get("playerId");
  if (!playerId) {
    return Response.json({ error: "playerId is required" }, { status: 400 });
  }
  const player = await getPlayer({ playerId });
  if (!player) {
    return Response.json({ error: "player not found" }, { status: 404 });
  }

  const games = await getPlayerGames({ playerId, playerName: player.name });
  return Response.json({ games });
}
