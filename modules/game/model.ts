import { Model, model, models, Schema } from "mongoose";
import { GameMongo } from "./types";

const minimalPlayerModelSchema = {
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  games: { type: Number, required: true },
};

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
    winner: { type: String, required: true },
  },
  { _id: true, timestamps: true }
);

export const gameModel =
  (models.Game as Model<GameMongo>) ?? model("Game", gameModelSchema);
