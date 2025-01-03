import { baseSchemaOptions } from "@/database/utils";
import { Model, model, models, Schema } from "mongoose";
import { GameMongo, GamePlayer } from "./types";

const gamePlayerModelSchema = new Schema<GamePlayer>(
  {
    playerId: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    userName: { type: String, required: true },
    name: { type: String, required: false }, // memo: Legacy - le script n'a pas update ce champ
    games: { type: Number, required: true },
    rating: { type: Number, required: true },
    newRating: { type: Number, required: false },
  },
  { _id: false }
);

const gameModelSchema = new Schema<GameMongo>(
  {
    activityId: { type: Schema.Types.ObjectId, required: true },
    activityName: { type: String, required: true },
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
