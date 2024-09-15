import mongooseConnect from "@/database/config/mongoose";
import dayjs from "dayjs";
import { PlayerMongo } from "../player/types";
import { NO_GAMES_PLAYED_TODAY, QUOTE_TYPES } from "./constants";
import { generateQuoteOfTheDay } from "./generate";
import { quoteModel } from "./model";
import { QuoteMongo } from "./types";

export const getOrCreateQuoteOfTheDay = async (): Promise<
  QuoteMongo["quote"]
> => {
  await mongooseConnect();
  const quote = await quoteModel
    .findOne({
      type: QUOTE_TYPES.quote_of_the_day,
      createdAt: { $gte: dayjs().startOf("day").toDate() },
    })
    .lean();
  if (quote) return quote.quote;

  const newQuote = await generateQuoteOfTheDay();
  return (
    await quoteModel.create({
      type: QUOTE_TYPES.quote_of_the_day,
      quote: newQuote,
      quoteHistory: [newQuote],
    })
  ).quote;
};

export const getPlayerQuoteOfTheDay = async (
  playerName: PlayerMongo["name"]
): Promise<QuoteMongo["quote"]> => {
  await mongooseConnect();
  const quote = await quoteModel
    .findOne({
      type: QUOTE_TYPES.player_quote,
      playerName,
      createdAt: { $gte: dayjs().startOf("day").toDate() },
    })
    .lean();

  if (!quote) return NO_GAMES_PLAYED_TODAY;

  return quote.quote;
};
