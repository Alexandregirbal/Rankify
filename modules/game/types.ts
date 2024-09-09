import { z } from "zod";
import { gameMongoSchema, gameSchema } from "./schemas";

export type Game = z.infer<typeof gameSchema>;

export type GameMongo = z.infer<typeof gameMongoSchema>;
