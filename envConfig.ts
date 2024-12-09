import { loadEnvConfig } from "@next/env";
import { z } from "zod";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const envSchema = z.object({
  MONGODB_URI: z.string().url(),
  GAMES_TO_BE_RANKABLE: z.coerce.number().default(1),
  ADMIN_TOKEN: z.string().default("admin_token"),
  VERCEL_URL: z.string().default("http://localhost:3000"),
  OPENAI_API_KEY: z.string().optional(),
});

export const getEnvConfigs = () => {
  const env = process.env;
  const parsedEnv = envSchema.safeParse(env);
  if (!parsedEnv.success) {
    throw new Error(
      `Invalid environment variables ${parsedEnv.error.toString()}`
    );
  }
  return parsedEnv.data;
};
