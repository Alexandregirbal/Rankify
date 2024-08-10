import { calculatePlayersRatings } from "@/modules/elo/ratings";
import { Player } from "@/modules/elo/types";
import { createGame } from "@/modules/game/create";
import { getPlayer } from "@/modules/player/get";
import { updatePlayerRating } from "@/modules/player/update";

export async function POST(request: Request) {
  const { player1, player2 } = await request.json();
  if (!player1 || !player2) {
    return Response.json({ error: "Players are required" }, { status: 400 });
  }
  const player1Data = (await getPlayer(player1.name)) as Player | null;
  const player2Data = (await getPlayer(player2.name)) as Player | null;

  if (!player1Data || !player2Data) {
    return Response.json(
      { error: "Players not found in database" },
      { status: 400 }
    );
  }

  await createGame({
    player1Name: player1Data.name,
    player2Name: player2Data.name,
    scores: [player1.score, player2.score],
  });

  const newPlayersRatings = calculatePlayersRatings(
    [player1Data],
    [player2Data],
    [player1.score, player2.score]
  );

  for (const player of newPlayersRatings) {
    await updatePlayerRating(player.name, player.rating);
  }

  return Response.json({ message: "Game added successfully" }, { status: 200 });
}
