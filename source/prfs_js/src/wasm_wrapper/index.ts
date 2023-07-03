import * as Comlink from "comlink";

export async function initWasm() {
  console.log("init()");

  const handlers = await (
    Comlink.wrap(
      new Worker(new URL("./wasm_worker.js", import.meta.url), {
        type: "module"
      })
    ) as any
  ).handlers;

  if (!handlers) {
    console.log("handlers not found");
    return;
  }

  return handlers;
}
