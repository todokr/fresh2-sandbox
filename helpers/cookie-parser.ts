import { assertEquals } from "jsr:@std/assert";

type Cookie = { [key: string]: string };

export function parseCookie(
  value: string | null | undefined,
): { get: (name: string) => string | undefined } {
  if (!value) return { get: () => undefined };
  const pairs = value.split(";").map((v) => v.trim());
  const cookies = Object.fromEntries(
    pairs
      .map((p) => p.split("="))
      .filter((p) => p.length === 2),
  );

  return { get: (key: string) => cookies[key] };
}

Deno.test("parseCookie", () => {
  const value = "A=1; B=2; C=3";
  const actual = parseCookie(value);

  assertEquals(actual.get("A"), "1");
  assertEquals(actual.get("B"), "2");
  assertEquals(actual.get("C"), "3");
});

Deno.test("parseCookie empty", () => {
  const actual = parseCookie(undefined);
  assertEquals(actual.get("A"), undefined);
});
