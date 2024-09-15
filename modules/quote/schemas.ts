import { baseMongoSchema } from "@/database/utils";
import { z } from "zod";

export const quoteSchema = z.object({
  type: z.string(),
  playerName: z.string().optional(),
  quote: z.string(),
  quoteHistory: z.array(z.string()),
});

export const quoteMongoSchema = baseMongoSchema.merge(quoteSchema);
