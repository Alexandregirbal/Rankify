import { baseMongoSchema } from "@/database/utils";
import { z } from "zod";
import { DEFAULT_RATING } from "../elo/constants";

const ratingHistorySchema = z.array(
  z.object({
    date: z.date(),
    rating: z.number(),
  })
);

export const playerSchema = z.object({
  name: z.string().min(2),
  games: z.number().default(0),
  rating: z.number().default(DEFAULT_RATING),
  ratingHistory: ratingHistorySchema.default([]),
});

export const playerMongoSchema = baseMongoSchema.merge(playerSchema);
