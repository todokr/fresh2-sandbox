import "jsr:@std/dotenv/load";

import { App, fsRoutes, staticFiles, trailingSlashes } from "@fresh/core";
import { AppState } from "./utils.ts";
import { authMiddleware, AuthzEngine } from "./middleware/authorization.ts";
import { authenticationMiddleware } from "./middleware/authentication.ts";
import { accessLog } from "./middleware/accesslog.ts";
import { appConfig } from "./config.ts";

const authzEngine: AuthzEngine = (state: AppState) => {
  const memberId = state.authn.memberId;

  if (memberId === "admin") {
    return {
      decision: "allow",
      scope: "full",
    };
  } else if (memberId === "operator1") {
    return {
      decision: "allow",
      scope: new Set(["A", "B"]),
    };
  } else if (memberId === "operator2") {
    return {
      decision: "allow",
      scope: new Set(["C"]),
    };
  } else {
    return {
      decision: "deny",
    };
  }
};

export const app = new App<AppState>()
  .use(trailingSlashes("never"))
  .use(staticFiles())
  .use(authenticationMiddleware(appConfig.authentication))
  .use(accessLog)
  .use(authMiddleware("/protected", authzEngine))
  .get("/api/:joke", () => new Response("Hello World"));

await fsRoutes(app, {
  dir: "./",
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
  await app.listen();
}
