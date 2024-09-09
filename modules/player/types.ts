import { z } from "zod";
import {
  minimalPlayerSchema,
  playerMongoSchema,
  playerSchema,
} from "./schemas";

export type Player = z.infer<typeof playerSchema>;
export type PlayerMongo = z.infer<typeof playerMongoSchema>;

export type MinimalPlayer = z.infer<typeof minimalPlayerSchema>;
