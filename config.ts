import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import { parse } from "@std/yaml";

const AuthenticationConfig = z.object({
  cookie: z.object({
    name: z.string(),
    maxAge: z.number(),
  }),
});

export type AuthenticationConfig = z.infer<typeof AuthenticationConfig>;

const AppConfig = z.object({
  authentication: AuthenticationConfig,
});

type AppConfig = z.infer<typeof AppConfig>;

const raw = parse(Deno.readTextFileSync("app-config.yml"));

export const appConfig = AppConfig.parse(raw);
console.info("Loaded Config\n", appConfig);
