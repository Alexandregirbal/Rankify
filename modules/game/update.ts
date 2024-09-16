import { ZodObjectId } from "@/database/utils";
import { playerModel } from "../player/model";
import { gameModel } from "./model";

export const rollbackGame = async (gameId: ZodObjectId) => {
  const gameToDelete = await gameModel.findOne({ _id: gameId }).lean();
  if (!gameToDelete) return null;

  const [lastGamePlayed] = await gameModel
    .find({}, null, { sort: { createdAt: -1 }, limit: 1 })
    .lean();
  if (!lastGamePlayed) return null;

  if (lastGamePlayed._id.toString() !== gameToDelete._id.toString())
    return {
      success: false,
      error: "Cannot rollback a game that is not the last one, yet.",
      details: {
        lastGamePlayedId: lastGamePlayed._id,
        gameToDeleteId: gameToDelete._id,
      },
    };

  const players = [...gameToDelete.team1, ...gameToDelete.team2];
  const playersIds = players.map((player) => player._id);

  const activePlayers = await playerModel
    .countDocuments({ _id: { $in: playersIds } })
    .exec();

  if (activePlayers !== playersIds.length)
    return {
      success: false,
      error:
        "Cannot rollback a game that has a player that does not exist anymore.",
      details: {
        activePlayers,
        playersIds,
      },
    };

  const [deletedGame, ...updatedPlayers] = await Promise.all([
    gameModel.deleteOne({ _id: gameId }).exec(),
    ...players.map((player) =>
      playerModel.updateOne(
        { _id: player._id },
        {
          $set: {
            rating: player.rating,
          },
          $pop: { ratingHistory: 1 },
          $inc: { games: -1 },
        }
      )
    ),
  ]);

  return {
    success: true,
    deletedGame,
    updatedPlayers,
  };
};
