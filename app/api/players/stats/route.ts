import { zodObjectId } from "@/database/utils";
import {
  getMostLossesAgainst,
  getMostWinsAgainst,
  getNumberOfGamesSince,
  getTotalNumberOfGames,
  getTotalNumberOfWins,
} from "@/modules/game/get";
import { getPlayer } from "@/modules/player/get";
import { getExtremPlayerStreak } from "@/modules/player/utils";
import { getPlayerQuoteOfTheDay } from "@/modules/quote/get";
import dayjs from "dayjs";
import { getMostFrequentTeammate } from "@/modules/game/get";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get("playerId");

  if (!playerId) {
    return Response.json({ error: "playerId is required" }, { status: 400 });
  }

  if (zodObjectId.safeParse(playerId).success === false) {
    return Response.json(
      { error: "playerId is not a valid ObjectId" },
      { status: 400 }
    );
  }

  const player = await getPlayer({ playerId });
  if (!player) {
    return Response.json({ error: "player not found" }, { status: 404 });
  }

  const [
    totalNumberOfGamesPlayed,
    numberOfGamesPlayedToday,
    totalNumberOfWins,
    playerQuote,
    mostLossesAgainst,
    mostWinsAgainst,
    mostFrequentTeammate,
  ] = await Promise.all([
    getTotalNumberOfGames({ playerId, playerName: player.name }),
    getNumberOfGamesSince({
      since: dayjs().startOf("day").toDate(),
      playerId,
      playerName: player.name,
    }),
    getTotalNumberOfWins(playerId, player.name),
    getPlayerQuoteOfTheDay(playerId),
    getMostLossesAgainst(playerId),
    getMostWinsAgainst(playerId),
    getMostFrequentTeammate(playerId),
  ]);

  return Response.json({
    totalNumberOfGamesPlayed,
    numberOfGamesPlayedToday,
    winLossRatio: +(totalNumberOfWins / totalNumberOfGamesPlayed).toFixed(2),
    extremeStreaks: getExtremPlayerStreak({
      ratingHistory: player.ratingHistory,
    }),
    playerQuote,
    mostLossesAgainst,
    mostWinsAgainst,
    mostFrequentTeammate,
  });
}
