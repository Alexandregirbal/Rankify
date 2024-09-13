import { baseMongoSchema } from "@/database/utils";
import { z } from "zod";
import { teamSchema } from "../player/schemas";

export const gameSchema = z.object({
  team1: teamSchema,
  team2: teamSchema,
  scores: z.array(z.number()).length(2),
  winner: z.enum(["1", "2"]),
  eliminationFoul: z.string().optional(),
});

export const gameMongoSchema = baseMongoSchema.merge(gameSchema);
