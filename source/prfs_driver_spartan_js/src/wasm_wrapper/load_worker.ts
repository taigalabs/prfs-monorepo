import * as Comlink from "comlink";

export async function initWasm() {
  console.log("init()");

  const worker = new Worker(new URL("./wasm_worker.js", import.meta.url), {
    type: "module",
  });

  const handlers = await (Comlink.wrap(worker) as any).handlers;

  if (!handlers) {
    console.log("handlers not found");
    throw new Error("handler not found");
  }

  return handlers;
}
