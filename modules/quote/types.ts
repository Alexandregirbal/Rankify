import { z } from "zod";
import { quoteMongoSchema, quoteSchema } from "./schemas";

export type Quote = z.infer<typeof quoteSchema>;

export type QuoteMongo = z.infer<typeof quoteMongoSchema>;
