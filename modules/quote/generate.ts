import { getEnvConfigs } from "@/envConfig";
import dayjs from "dayjs";
import OpenAI from "openai";
import { type ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { getGamesSince } from "../game/get";
import { GameMongo } from "../game/types";
import { OPEN_AI_MODEL, PROMPTS } from "./constants";

const getOpenAIClient = () => {
  const apiKey = getEnvConfigs().OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  return new OpenAI({
    apiKey,
  });
};

export const generateQuoteOfTheDay = async (
  newGame?: GameMongo
): Promise<string> => {
  const games = await getGamesSince(dayjs().startOf("day").toDate());
  if (newGame) games.push(newGame);

  const openAIClient = getOpenAIClient();
  if (!openAIClient) {
    return "ChatGPT n'est pas configuré.";
  }

  const quote = await openAIClient.chat.completions.create({
    messages: [
      {
        role: "system",
        content: PROMPTS.quote_of_the_day.system,
      },
      {
        role: "user",
        content: PROMPTS.quote_of_the_day.user,
      },
      ...(games.length > 0
        ? games.map<ChatCompletionMessageParam>((game) => ({
            role: "user",
            content: JSON.stringify(game),
          }))
        : [
            {
              role: "user",
              content: "Aucune partie joué aujourd'hui",
            } as ChatCompletionMessageParam,
          ]),
    ],
    model: OPEN_AI_MODEL,
  });

  return quote.choices[0].message.content || "ChatGPT fait la grève.";
};
