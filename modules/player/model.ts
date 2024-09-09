import { baseSchemaOptions } from "@/database/utils";
import { Model, model, models, Schema } from "mongoose";
import { PlayerMongo } from "./types";

const ratingHistoryModelSchema = {
  date: { type: Date, required: true },
  rating: { type: Number, required: true },
};

const playerModelSchema = new Schema<PlayerMongo>(
  {
    name: { type: String, required: true },
    games: { type: Number, required: true },
    rating: { type: Number, required: true },
    ratingHistory: {
      type: [ratingHistoryModelSchema],
      required: true,
      default: [],
    },
  },
  baseSchemaOptions
);

export const playerModel =
  (models.Player as Model<PlayerMongo>) ?? model("Player", playerModelSchema);
