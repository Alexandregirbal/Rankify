import { zodObjectId } from "@/database/utils";
import { z } from "zod";

export const minimalPlayerSchema = z.object({
  playerId: zodObjectId,
  name: z.string(),
  games: z.number(),
  rating: z.number(),
});

export const teamScoringSchema = z.object({
  players: z.array(minimalPlayerSchema),
  score: z.number(),
  eliminationFoul: z.string().optional(),
});
