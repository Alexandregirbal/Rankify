import { loadEnvConfig } from "@next/env";
import { z } from "zod";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const envSchema = z.object({
  MONGODB_URI: z.string().url(),
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
