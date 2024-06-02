import { page } from "@fresh/core";
import { define } from "../utils.ts";
import { Authentication, createSession } from "../middleware/authentication.ts";
import { appConfig } from "../config.ts";
import { getCryptokey } from "../helpers/jwt.ts";

export const handler = define.handlers({
  GET(ctx) {
    return page({ ctx });
  },
  async POST(ctx) {
    const form = await ctx.req.formData();
    const memberId = form.get("username");
    if (!memberId) return new Response("Invalid username", { status: 400 });

    const auth: Authentication = {
      memberId: memberId as string,
      tenantId: "999",
    };

    const cryptoKey = await getCryptokey();
    const session = await createSession(
      appConfig.authentication,
      auth,
      cryptoKey,
    );

    return new Response(undefined, {
      status: 302,
      headers: {
        "Location": "/protected",
        "Set-Cookie": session,
      },
    });
  },
});

export default define.page<typeof handler>(({ data }) => {
  return (
    <>
      <div class="login">
        <div class="form">
          <h2>Login</h2>
          <form method="POST">
            <div class="form-group">
              <label for="userName">User Name</label>
              <input
                type="text"
                name="username"
                id="userName"
                placeholder="admin"
              />
            </div>
            <div class="action">
              <button type="submit">Login</button>
            </div>
          </form>
          <div class="examples">
            <h3>User Name examples</h3>
            <ul>
              <li>
                <code>admin</code>: Unlimited Scope(A, B, C)
              </li>
              <li>
                <code>operator1</code>: Limited Scope(A, B)
              </li>
              <li>
                <code>operator2</code>: Limited Scope(C)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
});
