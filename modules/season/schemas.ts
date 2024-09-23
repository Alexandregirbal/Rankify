import { baseMongoSchema, zodObjectId } from "@/database/utils";
import { z } from "zod";

export const leaderboardSchema = z.object({
  ranking: z.number(),
  playerId: zodObjectId,
  playreName: z.string(),
  rating: z.number(),
});

export const seasonSchema = z.object({
  number: z.number(),
  startDate: z.date(),
  endDate: z.date(),
  state: z.enum(["active", "ended"]),
  details: z.string().optional(),
  leaderboard: z.array(leaderboardSchema).optional(),
  archives: z.any().optional(),
});

export const seasonMongoSchema = baseMongoSchema.merge(seasonSchema);
