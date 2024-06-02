import { define } from "../../utils.ts";

export default define.page((ctx) => {
  const memberId = ctx.state.authn.memberId;
  const scope = ctx.state.scope;
  const show = scope === "full"
    ? "unlimited access"
    : Array.from(scope).join(", ");
  return (
    <>
      <h1>Protected Page</h1>
      <p>This is a protected page.</p>
      <p>Member ID: {memberId}</p>
      <p>Scope: {show}</p>
    </>
  );
});
