import { baseSchemaOptions } from "@/database/utils";
import { Model, model, models, Schema } from "mongoose";
import { GameMongo, GamePlayer } from "./types";

const gamePlayerModelSchema = new Schema<GamePlayer>(
  {
    playerId: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    name: { type: String, required: true },
    games: { type: Number, required: true },
    rating: { type: Number, required: true },
    newRating: { type: Number, required: false },
  },
  { _id: false }
);

const gameModelSchema = new Schema<GameMongo>(
  {
    team1: {
      type: [gamePlayerModelSchema],
      required: true,
    },
    team2: {
      type: [gamePlayerModelSchema],
      required: true,
    },
    eliminationFoul: { type: String, required: false },
    scores: { type: [Number], required: true },
    winner: { type: String, enum: ["1", "2"], required: true },
  },
  baseSchemaOptions
);

export const gameModel =
  (models.Game as Model<GameMongo>) ?? model("Game", gameModelSchema);
