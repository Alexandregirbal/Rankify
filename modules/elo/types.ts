import { z } from "zod";
import { minimalPlayerSchema, teamScoringSchema } from "./schemas";

export type MinimalPlayer = z.infer<typeof minimalPlayerSchema>;

export type NewPlayerRating = MinimalPlayer & { newRating: number };

export type TeamScoring = z.infer<typeof teamScoringSchema>;
