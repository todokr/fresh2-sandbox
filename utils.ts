import { createDefine } from "@fresh/core";
import { ScopeState } from "./middleware/authorization.ts";
import { AuthState } from "./middleware/authentication.ts";

export type AppState = ScopeState & AuthState;

export const define = createDefine<AppState>();
