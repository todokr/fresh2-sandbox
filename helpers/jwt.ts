import { create, verify } from "@wok/djwt";

export function getCryptokey(): Promise<CryptoKey> {
  const key = Deno.env.get("APP_SESSION_CRYPTO_KEY");

  if (!key) {
    throw new Error("APP_SESSION_CRYPTO_KEY is not set");
  }

  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign", "verify"],
  );
}

export function sign(
  payload: Record<string, string>,
  key: CryptoKey,
): Promise<string> {
  return create({ alg: "HS512", typ: "JWT" }, payload, key);
}

export function decode(
  jwt: string,
  key: CryptoKey,
): Promise<Record<string, string>> {
  return verify(jwt, key);
}
