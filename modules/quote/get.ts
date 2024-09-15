import mongooseConnect from "@/database/config/mongoose";
import dayjs from "dayjs";
import { QUOTE_TYPES } from "./constants";
import { generateQuoteOfTheDay } from "./generate";
import { quoteModel } from "./model";
import { QuoteMongo } from "./types";

export const getOrCreateQuoteOfTheDay = async (): Promise<QuoteMongo> => {
  await mongooseConnect();
  const today = dayjs().startOf("day").toDate();
  const tomorrow = dayjs().add(1, "day").startOf("day").toDate();
  const quote = await quoteModel
    .findOne({ createdAt: { $gte: today, $lte: tomorrow } })
    .lean();
  if (quote) return quote;

  const newQuote = await generateQuoteOfTheDay();
  return quoteModel.create({
    type: QUOTE_TYPES.quote_of_the_day,
    quote: newQuote,
    quoteHistory: [newQuote],
  });
};
