import { baseMongoSchema, zodObjectId } from "@/database/utils";
import { z } from "zod";

export const gamePlayerSchema = z.object({
  playerId: zodObjectId,
  userName: z.string(),
  games: z.number(),
  rating: z.number(),
  newRating: z.number().optional(),
});

export const teamSchema = z.array(gamePlayerSchema);

export const gameSchema = z.object({
  activityId: zodObjectId,
  activityName: z.string(),
  team1: teamSchema,
  team2: teamSchema,
  scores: z.array(z.number()).length(2),
  winner: z.enum(["1", "2"]),
  eliminationFoul: z.string().optional(),
});

export const gameMongoSchema = baseMongoSchema.merge(gameSchema);
