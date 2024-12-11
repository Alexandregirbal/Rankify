import { baseMongoSchema, zodObjectId } from "@/database/utils";
import { z } from "zod";
import { DEFAULT_RATING } from "../elo/constants";

export const ratingHistorySchema = z.object({
  date: z.date(),
  rating: z.number(),
});

export const trophySchema = z.object({
  activityId: zodObjectId.optional(),
  activityName: z.string().default("8-Ball"),
  season: z.number(),
  ranking: z.number(),
  rating: z.number(),
});

export const activityRating = z.object({
  activityId: zodObjectId,
  activityName: z.string(),
  ratingValue: z.number(),
  gamesPlayed: z.number(),
  ratingHistory: z.array(ratingHistorySchema).default([]),
});

export const playerSchema = z.object({
  name: z.string().min(2),
  games: z.number().optional().default(0), // TODO: remove once script ran
  rating: z.number().optional().default(DEFAULT_RATING), // TODO: remove once script ran
  ratingHistory: z.array(ratingHistorySchema).optional().default([]), // TODO: remove once script ran
  activitiesRatings: z.array(activityRating).optional().default([]),
  trophies: z.array(trophySchema).optional(),
});

export const playerMongoSchema = baseMongoSchema.merge(playerSchema);
