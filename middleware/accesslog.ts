import { define } from "../utils.ts";

export const accessLog = define.middleware(async (ctx) => {
  const now = Temporal.Now.instant().epochMilliseconds;
  const res = await ctx.next();
  const elapsedMillis = Temporal.Now.instant().epochMilliseconds - now;
  const log = {
    method: ctx.req.method,
    path: ctx.url.pathname,
    status: res.status,
    elapsedMillis,
    auth: ctx.state.authn,
  };
  console.info(JSON.stringify(log));
  return res;
});
