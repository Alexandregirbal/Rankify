import { playerModel } from "../player/model";
import { gameModel } from "./model";

export const rollbackLastGame = async () => {
  const [lastGamePlayed] = await gameModel
    .find({}, null, { sort: { createdAt: -1 }, limit: 1 })
    .lean();
  console.log(
    `~~~~~ Girbalog | rollbackLastGame | lastGamePlayed: `,
    lastGamePlayed
  );

  if (!lastGamePlayed)
    return {
      success: false,
      error: "last_game_undefined",
      details: "Last game played does not exist.",
    };

  const players = [...lastGamePlayed.team1, ...lastGamePlayed.team2];
  const playersIds = players.map((player) => player.playerId);

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
    gameModel.deleteOne({ _id: lastGamePlayed._id }).exec(),
    ...players.map((player) =>
      playerModel.updateOne(
        { _id: player.playerId },
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
    lastGamePlayed,
    updatedPlayers: updatedPlayers.length,
    deletedGame: deletedGame.deletedCount,
  };
};
