import { getEnvConfigs } from "@/envConfig";
import dayjs from "dayjs";
import OpenAI from "openai";
import { type ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { getGamesSince } from "../game/get";
import { GameMongo } from "../game/types";
import { OPEN_AI_MODEL } from "./constants";

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
        content:
          "Tu es un ancien joueur professionnel de billard qui s'est reconverti dans le commentary de partie de billard pour une entreprise. Tu as une personnalité méchante, violente, sournoise et impitoyable.",
      },
      {
        role: "user",
        content:
          "Je vais te donner une liste de parties qui se sont déroulées aujourd'hui. J'aimerais que tu me fasses un résumé de la journée en deux phrases.",
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
