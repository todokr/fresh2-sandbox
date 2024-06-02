import { FreshContext } from "https://jsr.io/@fresh/core/2.0.0-alpha.11/src/context.ts";
import { AppState, define } from "../../utils.ts";

export default async function Page(ctx: FreshContext<unknown, AppState>) {
  const { value: joke } = await fetch(
    "https://api.chucknorris.io/jokes/random",
  ).then((res) => res.json());

  const memberId = ctx.state.authn.memberId;
  const scope = ctx.state.scope;
  const show = scope === "full"
    ? "unlimited access"
    : Array.from(scope).join(", ");
  return (
    <>
      <div class="joke">
        <div class="title">
          <h1>Wisdom of Chuck Norris</h1>
          <p>You: {memberId} ({show})</p>
        </div>
        <cite>{joke}</cite>
      </div>
    </>
  );
}
