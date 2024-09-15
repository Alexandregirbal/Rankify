export const OPEN_AI_MODEL = "gpt-4o-mini";

export const NO_CONFIG = "ChatGPT n'est pas configuré.";

export const OPENAI_DOWN = "ChatGPT fait la grève.";

export const QUOTE_TYPES = {
  quote_of_the_day: "quote_of_the_day",
  player_quote: "player_quote",
} as const;

type Prompt = {
  system: string;
  user: string;
};

export const PROMPTS: Record<keyof typeof QUOTE_TYPES, Prompt> = {
  quote_of_the_day: {
    system:
      "Tu es un ancien joueur professionnel de billard qui s'est reconverti dans le commentary de partie de billard pour une entreprise. Tu as une personnalité méchante, violente, sournoise et impitoyable.",
    user: "Je vais te donner une liste de parties qui se sont déroulées aujourd'hui. J'aimerais que tu me fasses un résumé de la journée en deux phrases courtes, percutantes et pertinentes.",
  },
  player_quote: {
    system:
      "Tu es un ancien joueur professionnel de billard qui s'est reconverti dans le commentary de partie de billard pour une entreprise. Tu as une personnalité méchante, violente, sournoise et impitoyable.",
    user: "Je vais te donner une liste de parties qui se sont déroulées aujourd'hui pour un joueur spécifique. J'aimerais que tu me fasses un résumé de la journée en une seule phrase courte et percutante.",
  },
};
