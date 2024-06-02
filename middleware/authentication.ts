import { define } from "../utils.ts";
import { parseCookie } from "../helpers/cookie-parser.ts";
import { decode, getCryptokey, sign } from "../helpers/jwt.ts";
import { AuthenticationConfig } from "../config.ts";

export type AuthState = {
  authn: Authentication;
};

export type Authentication = {
  memberId?: string;
  tenantId?: string;
};

function isAuthentication(value: unknown): value is Authentication {
  return value instanceof Object && "memberId" in value && "tenantId" in value;
}

export async function createSession(
  config: AuthenticationConfig,
  value: Authentication,
  cryptoKey: CryptoKey,
) {
  const jwtValue = await sign(value, cryptoKey);
  return `${config.cookie.name}=${jwtValue}; Max-Age=${config.cookie.maxAge}; Path=/; HttpOnly; Secure; SameSite=Strict`;
}

export function authenticationMiddleware(config: AuthenticationConfig) {
  return define.middleware(async (ctx) => {
    const cryptoKey = await getCryptokey();
    const cookies = ctx.req.headers.get("Cookie");
    const sessionJwt = parseCookie(cookies).get(config.cookie.name);
    if (!sessionJwt) return ctx.next();

    const session = await decode(sessionJwt, cryptoKey);
    if (!isAuthentication(session)) {
      console.warn("Invalid session value found", session);
      return ctx.next();
    }

    ctx.state.authn = {
      memberId: session.memberId,
      tenantId: session.tenantId,
    };
    return ctx.next();
  });
}
