import { z } from "zod";
import { minimalPlayerSchema } from "../player/schemas";

export const teamScoringSchema = z.object({
  players: z.array(minimalPlayerSchema),
  score: z.number(),
});

export type TeamScoring = z.infer<typeof teamScoringSchema>;
