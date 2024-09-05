import { calculatePlayersRatings } from "@/modules/elo/ratings";
import { createGame } from "@/modules/game/create";
import { getGames } from "@/modules/game/get";
import { updatePlayerRating } from "@/modules/player/update";

export async function POST(request: Request) {
  const { team1, team2 } = await request.json();
  if (!team1 || !team2) {
    return Response.json({ error: "teams are required" }, { status: 400 });
  }

  await createGame({
    team1,
    team2,
  });

  const newPlayersRatings = calculatePlayersRatings(team1, team2);
  const result = [];
  for (const player of newPlayersRatings) {
    result.push(await updatePlayerRating(player.name, player.rating));
  }

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

  const games = await getGames(name);
  return Response.json({ games });
}
