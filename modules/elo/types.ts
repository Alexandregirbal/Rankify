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

export const teamSchema = z.array(playerSchema);
export type Team = z.infer<typeof teamSchema>;

export const teamScoringSchema = z.object({
  players: teamSchema,
  score: z.number(),
});
export type TeamScoring = z.infer<typeof teamScoringSchema>;

export const gameSchema = z.object({
  team1: z.any(),
  team2: z.any(),
  scores: z.array(z.number),
  winner: z.number(),
});

export type Game = z.infer<typeof gameSchema>;
