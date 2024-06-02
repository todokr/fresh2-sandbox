import { FreshContext } from "@fresh/core";

export default async function Page(_ctx: FreshContext) {
  const { value: joke } = await fetch(
    "https://api.chucknorris.io/jokes/random",
  ).then((res) => res.json());

  return (
    <>
      <h1>Server-side async component</h1>
      <pre>{JSON.stringify(joke, null, 2)}</pre>
    </>
  );
}
