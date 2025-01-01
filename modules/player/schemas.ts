import { baseMongoSchema, zodObjectId } from "@/database/utils";
import { z } from "zod";
import { DEFAULT_RATING } from "../elo/constants";

export const ratingHistorySchema = z.object({
  date: z.date(),
  rating: z.number(),
});

export const trophySchema = z.object({
  season: z.number(),
  ranking: z.number(),
  rating: z.number(),
});

export const playerSchema = z.object({
  userId: zodObjectId,
  name: z.string().optional(), // TODO: remove after migration
  userName: z.string(),
  activityId: zodObjectId,
  activityName: z.string(),
  games: z.number().optional().default(0),
  rating: z.number().optional().default(DEFAULT_RATING),
  ratingHistory: z.array(ratingHistorySchema).optional().default([]),
  trophies: z.array(trophySchema).optional(),
});

export const playerMongoSchema = baseMongoSchema.merge(playerSchema);
