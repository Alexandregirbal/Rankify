import { baseSchemaOptions } from "@/database/utils";
import { model, Model, models, Schema } from "mongoose";
import { QuoteMongo } from "./types";

const QuoteModel = new Schema<QuoteMongo>(
  {
    type: { type: String, required: true },
    playerId: { type: Schema.Types.ObjectId, ref: "Player", required: false },
    quote: { type: String, required: true },
    quoteHistory: { type: [String], required: true, default: [] },
  },
  baseSchemaOptions
);

export const quoteModel =
  (models.Quote as Model<QuoteMongo>) ?? model("Quote", QuoteModel);
