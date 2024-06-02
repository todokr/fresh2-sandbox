import { FreshContext } from "https://jsr.io/@fresh/core/2.0.0-alpha.11/src/context.ts";
import { HttpError } from "@fresh/core";

export default function ErrorPage(ctx: FreshContext) {
  // Exact signature to be determined, but the status
  // code will live somewhere in "ctx"
  const err = ctx.error as HttpError;

  if (err.status === 404) {
    return <h1>This is not the page you're looking for</h1>;
  } else {
    return <h1>Sorry - Some other error happend!</h1>;
  }
}
