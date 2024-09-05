import { z } from "zod";

export const playerSchema = z.object({
  name: z.string(),
  rating: z.number(),
  ratingHistory: z.array(
    z.object({
      date: z.date(),
      rating: z.number(),
    })
  ),
  games: z.number(),
});
export type Player = z.infer<typeof playerSchema>;

export const teamScoringSchema = z.object({
  players: z.array(playerSchema),
  score: z.number(),
});
export type TeamScoring = z.infer<typeof teamScoringSchema>;
