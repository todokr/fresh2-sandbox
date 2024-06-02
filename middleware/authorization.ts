import { AppState, define } from "../utils.ts";

export type ScopeState = { scope: Scope };

type Scope = "full" | Set<string>;

type Allow = { result: "allow"; scope: Scope };

type Deny = { result: "deny" };

type Decision = Allow | Deny;

export type AuthzEngine = (state: AppState) => Decision | Promise<Decision>;

export function authMiddleware(
  protectionPath: string,
  decider: AuthzEngine,
) {
  return define.middleware(
    async (ctx) => {
      if (ctx.url.pathname.startsWith(protectionPath)) {
        const decision = await decider(ctx.state);
        if (decision.result === "allow") {
          ctx.state.scope = decision.scope;
          return ctx.next();
        } else {
          return new Response(null, { status: 401 });
        }
      } else {
        return ctx.next();
      }
    },
  );
}
