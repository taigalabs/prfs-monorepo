import * as Comlink from "comlink";

export async function initWasm() {
  const worker = new Worker(new URL("./wasm_worker.js", import.meta.url), {
    type: "module",
  });

  const remote = await Comlink.wrap(worker);
  const handlers = remote.handlers;

  if (!handlers) {
    console.log("handlers not found");
    throw new Error("handler not found");
  }

  return handlers;
}
