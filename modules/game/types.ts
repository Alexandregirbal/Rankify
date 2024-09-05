import { z } from "zod";
import { playerSchema } from "../elo/types";

export const gameSchema = z.object({
  team1: z.array(playerSchema),
  team2: z.array(playerSchema),
  scores: z.array(z.number()),
  winner: z.string(),
});

export type Game = z.infer<typeof gameSchema>;
