import { z } from "zod";
import {
  playerMongoSchema,
  playerSchema,
  ratingHistorySchema,
  trophySchema,
} from "./schemas";

export type RatingHistory = z.infer<typeof ratingHistorySchema>;

export type Trophy = z.infer<typeof trophySchema>;

export type Player = z.infer<typeof playerSchema>;
export type PlayerMongo = z.infer<typeof playerMongoSchema>;
