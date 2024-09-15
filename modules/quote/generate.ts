import { getEnvConfigs } from "@/envConfig";
import dayjs from "dayjs";
import OpenAI from "openai";
import { type ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { getGamesSince, getPlayerGames } from "../game/get";
import { GameMongo } from "../game/types";
import { NO_CONFIG, OPEN_AI_MODEL, OPENAI_DOWN, PROMPTS } from "./constants";

const getOpenAIClient = () => {
  const apiKey = getEnvConfigs().OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  return new OpenAI({
    apiKey,
  });
};

const generateGamesChatCompletion = (
  games: GameMongo[]
): ChatCompletionMessageParam[] => {
  if (games.length === 0)
    return [
      {
        role: "user",
        content: "Aucune partie joué aujourd'hui",
      } as ChatCompletionMessageParam,
    ];

  return games.map<ChatCompletionMessageParam>((game) => ({
    role: "user",
    content: JSON.stringify(game),
  }));
};

export const generateQuoteOfTheDay = async (
  newGame?: GameMongo
): Promise<string> => {
  const games = await getGamesSince(dayjs().startOf("day").toDate());
  if (newGame) games.push(newGame);

  const openAIClient = getOpenAIClient();
  if (!openAIClient) return NO_CONFIG;

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
      ...generateGamesChatCompletion(games),
    ],
    model: OPEN_AI_MODEL,
  });

  return quote.choices[0].message.content ?? OPENAI_DOWN;
};

export const generatePlayerQuote = async (
  playerName: string
): Promise<string> => {
  const openAIClient = getOpenAIClient();
  if (!openAIClient) return NO_CONFIG;

  const games = await getPlayerGames({
    playerName,
    since: dayjs().startOf("day").toDate(),
  });

  const quote = await openAIClient.chat.completions.create({
    messages: [
      {
        role: "system",
        content: PROMPTS.player_quote.system,
      },
      {
        role: "user",
        content: PROMPTS.player_quote.user,
      },
      ...generateGamesChatCompletion(games),
    ],
    model: OPEN_AI_MODEL,
  });

  return quote.choices[0].message.content ?? OPENAI_DOWN;
};
