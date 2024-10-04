import mongooseConnect from "@/database/config/mongoose";
import { PlayerMongo } from "../player/types";
import { gameModel } from "./model";
import { GameMongo } from "./types";
import { PipelineStage } from "mongoose";
import { log } from "console";
import { ObjectId } from "mongodb";

export const getTotalNumberOfGames = async ({
  playerId,
  playerName,
}: {
  playerId?: PlayerMongo["_id"];
  playerName?: PlayerMongo["name"];
}): Promise<number> => {
  await mongooseConnect();

  const conditions: Record<string, any> = {};

  if (playerId) {
    conditions.$or = [
      { "team1.playerId": playerId },
      { "team2.playerId": playerId },
      ...(playerName
        ? [{ "team1.name": playerName }, { "team2.name": playerName }]
        : []),
    ];
  }

  return gameModel.countDocuments(conditions).lean();
};

export const getTotalNumberOfWins = async (
  playerId: PlayerMongo["_id"],
  playerName: PlayerMongo["name"]
): Promise<number> => {
  await mongooseConnect();

  const [winsInTeam1, winsInTeam2] = await Promise.all([
    gameModel
      .countDocuments({
        $or: [{ "team1.playerId": playerId }, { "team1.name": playerName }],
        winner: "1",
      })
      .lean(),
    gameModel
      .countDocuments({
        $or: [{ "team2.playerId": playerId }, { "team2.name": playerName }],
        winner: "2",
      })
      .lean(),
  ]);

  return winsInTeam1 + winsInTeam2;
};

export const getNumberOfGamesSince = async ({
  since = new Date(2024, 0, 1),
  playerId,
  playerName,
}: {
  since?: Date;
  playerId?: PlayerMongo["_id"];
  playerName?: PlayerMongo["name"];
}) => {
  await mongooseConnect();

  const conditions: Record<string, any> = { createdAt: { $gte: since } };

  if (playerId) {
    conditions.$or = [
      { "team1.playerId": playerId },
      { "team2.playerId": playerId },
      ...(playerName
        ? [{ "team1.name": playerName }, { "team2.name": playerName }]
        : []),
    ];
  }

  return gameModel.countDocuments(conditions).lean();
};

export const getGamesSince = async (since: Date): Promise<GameMongo[]> => {
  await mongooseConnect();
  return gameModel.find({ createdAt: { $gte: since } }).lean();
};

export const getAllGames = async (): Promise<GameMongo[]> => {
  await mongooseConnect();
  return gameModel.find({}, null, { sort: { rating: -1 } }).lean();
};

export const getPlayerGames = async ({
  playerId,
  playerName,
  since,
}: {
  playerId: PlayerMongo["_id"];
  playerName: PlayerMongo["name"];
  since?: Date;
}): Promise<GameMongo[]> => {
  await mongooseConnect();
  return gameModel
    .find(
      {
        $or: [
          { "team1.playerId": playerId },
          { "team2.playerId": playerId },
          { "team1.name": playerName },
          { "team2.name": playerName },
        ],
        ...(since ? { createdAt: { $gte: since } } : {}),
      },
      null,
      { sort: { createdAt: -1 } }
    )
    .lean();
};

export const getMostGamesAgainst = async (
  playerId: PlayerMongo["_id"],
  type: "wins" | "losses"
): Promise<{
  name: string;
  count: number;
  totalScore: { for: number; against: number };
} | null> => {
  await mongooseConnect();

  const playerIdObjectId = new ObjectId(playerId);

  const pipeline: PipelineStage[] = [
    {
      $match: {
        $or: [
          { "team1.playerId": playerIdObjectId },
          { "team2.playerId": playerIdObjectId },
        ],
      },
    },
    {
      $addFields: {
        playerTeam: {
          $cond: [
            { $in: [playerIdObjectId, "$team1.playerId"] },
            "$team1",
            "$team2",
          ],
        },
        opponentTeam: {
          $cond: [
            { $in: [playerIdObjectId, "$team1.playerId"] },
            "$team2",
            "$team1",
          ],
        },
        playerTeamNumber: {
          $cond: [{ $in: [playerIdObjectId, "$team1.playerId"] }, "1", "2"],
        },
      },
    },
    {
      $project: {
        opponentTeam: 1,
        playerWon: { $eq: ["$winner", "$playerTeamNumber"] },
        playerScore: {
          $cond: [
            { $eq: ["$playerTeamNumber", "1"] },
            { $arrayElemAt: ["$scores", 0] },
            { $arrayElemAt: ["$scores", 1] },
          ],
        },
        opponentScore: {
          $cond: [
            { $eq: ["$playerTeamNumber", "1"] },
            { $arrayElemAt: ["$scores", 1] },
            { $arrayElemAt: ["$scores", 0] },
          ],
        },
      },
    },
    {
      $unwind: "$opponentTeam",
    },
    {
      $group: {
        _id: "$opponentTeam.playerId",
        name: { $first: "$opponentTeam.name" },
        wins: { $sum: { $cond: ["$playerWon", 1, 0] } },
        losses: { $sum: { $cond: ["$playerWon", 0, 1] } },
        totalGames: { $sum: 1 },
      },
    },
    {
      $sort: { [type]: -1, totalGames: -1 },
    },
    {
      $limit: 1,
    },
  ] as const;

  const result = await gameModel.aggregate(pipeline);

  if (result.length === 0) return null;

  return {
    name: result[0].name,
    count: result[0][type],
    totalScore: {
      for: type === "wins" ? result[0].wins : result[0].losses,
      against: type === "wins" ? result[0].losses : result[0].wins,
    },
  };
};

export const getMostWinsAgainst = (playerId: PlayerMongo["_id"]) =>
  getMostGamesAgainst(playerId, "wins");

export const getMostLossesAgainst = (playerId: PlayerMongo["_id"]) =>
  getMostGamesAgainst(playerId, "losses");

export const getMostFrequentTeammate = async (
  playerId: PlayerMongo["_id"]
): Promise<{
  name: string;
  count: number;
} | null> => {
  await mongooseConnect();

  const playerIdObjectId = new ObjectId(playerId);

  const pipeline: PipelineStage[] = [
    {
      $match: {
        $or: [
          { "team1.playerId": playerIdObjectId },
          { "team2.playerId": playerIdObjectId },
        ],
      },
    },
    {
      $addFields: {
        playerTeam: {
          $cond: [
            { $in: [playerIdObjectId, "$team1.playerId"] },
            "$team1",
            "$team2",
          ],
        },
      },
    },
    {
      $unwind: "$playerTeam",
    },
    {
      $match: {
        "playerTeam.playerId": { $ne: playerIdObjectId },
      },
    },
    {
      $group: {
        _id: "$playerTeam.playerId",
        name: { $first: "$playerTeam.name" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 1,
    },
  ];

  const result = await gameModel.aggregate(pipeline);

  if (result.length === 0) return null;

  return {
    name: result[0].name,
    count: result[0].count,
  };
};
