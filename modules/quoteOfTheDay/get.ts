import dayjs from "dayjs";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/src/resources/index.js";
import { getGames } from "../game/get";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getQuoteOfTheDay = async (): Promise<string> => {
  const games = await getGames(dayjs().startOf("day").toDate());

  const quote = await client.chat.completions.create({
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
    model: "gpt-4o-mini",
  });

  return quote.choices[0].message.content || "ChatGPT fait la grève.";
};
