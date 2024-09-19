import { z } from "zod";
import { playerMongoSchema, playerSchema } from "./schemas";

export type Player = z.infer<typeof playerSchema>;
export type PlayerMongo = z.infer<typeof playerMongoSchema>;
