import { AppState, define } from "../utils.ts";

export type ScopeState = { scope: Scope };
export type Scope = "full" | Set<string>;
type Allow = { decision: "allow"; scope: Scope };
type Deny = { decision: "deny" };
export type Decision = Allow | Deny;

const isAllowed = (decision: Decision): decision is Allow =>
  decision.decision === "allow";

export type AuthzEngine = (state: AppState) => Decision | Promise<Decision>;

export function authMiddleware(
  path: string,
  decider: AuthzEngine,
) {
  return define.middleware(
    async (ctx) => {
      if (ctx.url.pathname.startsWith(path)) {
        const decision = await decider(ctx.state);
        if (isAllowed(decision)) {
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
