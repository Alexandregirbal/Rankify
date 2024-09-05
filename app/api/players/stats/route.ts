import {
  getNumberOfGamesSince,
  getTotalNumberOfGames,
} from "@/modules/game/get";
import dayjs from "dayjs";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const playerName = searchParams.get("playerName") || "";

  if (!playerName) {
    return Response.json({ error: "playerName is required" }, { status: 400 });
  }

  const totalNumberOfGamesPlayed = await getTotalNumberOfGames({ playerName });
  const numberOfGamesPlayedToday = await getNumberOfGamesSince({
    since: dayjs().startOf("day").toDate(),
    playerName,
  });

  return Response.json({
    totalNumberOfGamesPlayed,
    numberOfGamesPlayedToday,
  });
}
