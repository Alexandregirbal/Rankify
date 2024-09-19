import mongooseConnect from "@/database/config/mongoose";
import dayjs from "dayjs";
import { GameMongo } from "../game/types";
import { PlayerMongo } from "../player/types";
import { QUOTE_TYPES } from "./constants";
import { generatePlayerQuote, generateQuoteOfTheDay } from "./generate";
import { quoteModel } from "./model";
import { QuoteMongo } from "./types";

export const upsertQuoteOfTheDay = async (
  newGame?: GameMongo
): Promise<QuoteMongo> => {
  await mongooseConnect();
  const newQuote = await generateQuoteOfTheDay(newGame);

  const today = dayjs().startOf("day").toDate();
  const tomorrow = dayjs().add(1, "day").startOf("day").toDate();

  const quote = await quoteModel.findOneAndUpdate(
    {
      type: QUOTE_TYPES.quote_of_the_day,
      createdAt: { $gte: today, $lte: tomorrow },
    },
    { $set: { quote: newQuote }, $push: { quoteHistory: newQuote } },
    { new: true, upsert: true }
  );

  if (quote) return quote;

  return quoteModel.create({
    type: QUOTE_TYPES.quote_of_the_day,
    quote: newQuote,
    quoteHistory: [newQuote],
  });
};

export const upsertPlayerQuoteOfTheDay = async (
  playerId: PlayerMongo["_id"],
  newGame?: GameMongo
): Promise<QuoteMongo> => {
  await mongooseConnect();
  const newQuote = await generatePlayerQuote({ playerId, newGame });

  const today = dayjs().startOf("day").toDate();
  const tomorrow = dayjs().add(1, "day").startOf("day").toDate();

  const quote = await quoteModel.findOneAndUpdate(
    {
      type: QUOTE_TYPES.player_quote,
      playerId,
      createdAt: { $gte: today, $lte: tomorrow },
    },
    { $set: { quote: newQuote }, $push: { quoteHistory: newQuote } },
    { new: true, upsert: true }
  );

  if (quote) return quote;

  return quoteModel.create({
    type: QUOTE_TYPES.player_quote,
    playerId,
    quote: newQuote,
    quoteHistory: [newQuote],
  });
};
