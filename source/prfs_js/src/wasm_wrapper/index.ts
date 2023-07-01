import * as Comlink from "comlink";
import * as prfsWasm from "./build/prfs_wasm";

export async function initWasm() {
  console.log("init()");

  const handlers = await (
    Comlink.wrap(
      new Worker(new URL("./wasm_worker.js", import.meta.url), {
        type: "module"
      })
    ) as any
  ).handlers;

  console.log("init() 22", handlers);

  if (!handlers) {
    console.log("handlers not found");
    return;
  }

  return handlers;
}
