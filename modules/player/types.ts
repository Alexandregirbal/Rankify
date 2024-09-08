import { z } from "zod";
import { minimalPlayerSchema, playerSchema } from "./schemas";

export type Player = z.infer<typeof playerSchema>;

export type MinimalPlayer = z.infer<typeof minimalPlayerSchema>;
