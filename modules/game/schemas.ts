import z from "@/database/extendedZod";
import { teamSchema } from "../player/schemas";

export const gameSchema = z.object({
  team1: teamSchema,
  team2: teamSchema,
  scores: z.array(z.number()).length(2),
  winner: z.enum(["1", "2"]),
});
