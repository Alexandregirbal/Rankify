import { z } from "zod";
import { leaderboardSchema, seasonMongoSchema, seasonSchema } from "./schemas";

export type Leaderboard = z.infer<typeof leaderboardSchema>;

export type Season = z.infer<typeof seasonSchema>;
export type SeasonMongo = z.infer<typeof seasonMongoSchema>;
