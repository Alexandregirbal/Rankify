import { getDatabaseClient } from "@/database/db";

export const updatePlayerRating = async (
  playerName: string,
  rating: number
) => {
  const db = getDatabaseClient();
  const player = await db.collection("players").findOneAndUpdate(
    { name: playerName },
    {
      $set: { rating },
      $inc: { games: 1 },
      $push: { ratingHistory: { rating, date: new Date() } } as any,
    },
    { returnDocument: "after" }
  );
  return player;
};
