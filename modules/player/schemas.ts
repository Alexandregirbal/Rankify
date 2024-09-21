import { baseMongoSchema } from "@/database/utils";
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
  name: z.string().min(2),
  games: z.number().default(0),
  rating: z.number().default(DEFAULT_RATING),
  ratingHistory: z.array(ratingHistorySchema).default([]),
  trophies: z.array(trophySchema).optional(),
});

export const playerMongoSchema = baseMongoSchema.merge(playerSchema);
