import { HEADER_VARIABLES } from "@/app/constants";
import { getEnvConfigs } from "@/envConfig";
import { getActivityName } from "@/modules/activity/get";
import { calculatePlayersRatings } from "@/modules/elo/ratings";
import { teamScoringSchema } from "@/modules/elo/schemas";
import { createGame } from "@/modules/game/create";
import { getPlayerGames } from "@/modules/game/get";
import { getPlayer, getPlayers } from "@/modules/player/get";
import { updatePlayerRating } from "@/modules/player/update";
import { revalidatePath } from "next/cache";
import { join } from "path";
import { z } from "zod";
import { buildFullUrl } from "../utils";

const requestBodySchema = z.object({
  team1: teamScoringSchema,
  team2: teamScoringSchema,
});

export async function POST(request: Request) {
  const activityId = request.headers.get(HEADER_VARIABLES.activityId);
  if (!activityId) {
    return Response.json({ error: "Activity is required" }, { status: 401 });
  }

  const activityName = await getActivityName(activityId);
  if (!activityName) {
    return Response.json(
      { error: "Activity could not be found" },
      { status: 400 }
    );
  }

  const requestBody = await request.json();
  const requestBodyResult = requestBodySchema.safeParse(requestBody);
  if (!requestBodyResult.success) {
    return Response.json(
      { error: requestBodyResult.error.issues[0].message },
      { status: 400 }
    );
  }

  const { team1, team2 } = requestBodyResult.data;

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

  revalidatePath(`/${activityName}`, "layout"); // Revalidating all data (https://nextjs.org/docs/app/api-reference/functions/revalidatePath#revalidating-all-data)
  for (const player of [...team1Players, ...team2Players]) {
    revalidatePath(`/playerHistory/${player._id}`, "layout");
  }

  const updatedPlayers = await Promise.all(
    newPlayersRatings.map((player) =>
      updatePlayerRating({
        playerId: player.playerId,
        newRating: player.newRating,
      })
    )
  );

  await createGame({
    activity: {
      _id: activityId,
      name: activityName,
    },
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

  const playerIds = [...team1Players, ...team1Players].map(
    (player) => player._id
  );

  const urlWithoutProtocol = join(getEnvConfigs().VERCEL_URL, "/api/quote");
  fetch(buildFullUrl(urlWithoutProtocol), {
    method: "PUT",
    body: JSON.stringify(playerIds),
  });

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

  const games = await getPlayerGames({ playerId });
  return Response.json({ games });
}
