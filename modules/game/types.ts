import { z } from "zod";
import { gameSchema } from "./schemas";

export type Game = z.infer<typeof gameSchema>;
