import * as Comlink from "comlink";
import path from 'path';

export async function initWasm() {
  console.log("init()");

  let filename = path.resolve(__dirname, './wasm_worker.js');

  const handlers = await (
    Comlink.wrap(
      new Worker(filename, {
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
