import { baseSchemaOptions } from "@/database/utils";
import { Model, model, models, Schema } from "mongoose";
import { MinimalPlayer } from "../player/types";
import { GameMongo } from "./types";

const minimalPlayerModelSchema = new Schema<MinimalPlayer>(
  {
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    games: { type: Number, required: true },
  },
  { _id: false }
);

const gameModelSchema = new Schema<GameMongo>(
  {
    team1: {
      type: [minimalPlayerModelSchema],
      required: true,
    },
    team2: {
      type: [minimalPlayerModelSchema],
      required: true,
    },
    scores: { type: [Number], required: true },
    winner: { type: String, enum: ["1", "2"], required: true },
  },
  baseSchemaOptions
);

export const gameModel =
  (models.Game as Model<GameMongo>) ?? model("Game", gameModelSchema);
