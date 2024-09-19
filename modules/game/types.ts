import { z } from "zod";
import {
  gameMongoSchema,
  gamePlayerSchema,
  gameSchema,
  teamSchema,
} from "./schemas";

export type GamePlayer = z.infer<typeof gamePlayerSchema>;

export type Team = z.infer<typeof teamSchema>;

export type Game = z.infer<typeof gameSchema>;

export type GameMongo = z.infer<typeof gameMongoSchema>;
