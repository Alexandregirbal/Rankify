import z from "@/database/extendedZod";
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

export const minimalPlayerSchema = playerSchema
  .pick({
    name: true,
    rating: true,
    games: true,
  })
  .describe("Minimal player schema need to recalculate ratings");

export const teamSchema = z.array(minimalPlayerSchema);
