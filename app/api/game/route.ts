import { calculatePlayersRatings } from "@/modules/elo/ratings";
import { teamScoringSchema } from "@/modules/elo/types";
import { createGame } from "@/modules/game/create";
import { getPlayerGames } from "@/modules/game/get";
import { getPlayers } from "@/modules/player/get";
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

  const team1Players = await getPlayers(
    team1.players.map((player) => player.name)
  );

  const team2Players = await getPlayers(
    team2.players.map((player) => player.name)
  );

  const newGame = await createGame({
    team1: { players: team1Players, score: team1.score },
    team2: { players: team2Players, score: team2.score },
  });

  const allPlayer = [...newGame.team1, ...newGame.team2];
  await Promise.all([
    upsertQuoteOfTheDay(newGame),
    ...allPlayer.map((player) =>
      upsertPlayerQuoteOfTheDay(player.name, newGame)
    ),
  ]);

  const newPlayersRatings = calculatePlayersRatings(team1, team2);

  const result = [];
  for (const player of newPlayersRatings) {
    result.push(updatePlayerRating(player.name, player.rating));
  }

  await Promise.all(result);

  return Response.json(
    { message: "Game added successfully", details: result },
    { status: 200 }
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const name = url.searchParams.get("playerName");
  if (!name) {
    return Response.json({ error: "playerName is required" }, { status: 400 });
  }

  const games = await getPlayerGames({ playerName: name });
  return Response.json({ games });
}
