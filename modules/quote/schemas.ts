import { baseMongoSchema, zodObjectId } from "@/database/utils";
import { z } from "zod";

export const quoteSchema = z.object({
  type: z.string(),
  playerId: zodObjectId.optional(),
  quote: z.string(),
  quoteHistory: z.array(z.string()),
});

export const quoteMongoSchema = baseMongoSchema.merge(quoteSchema);
