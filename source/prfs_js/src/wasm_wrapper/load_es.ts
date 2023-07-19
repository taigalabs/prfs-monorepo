import * as Comlink from "comlink";

import { PrfsHandlers } from "../types";

export async function initWasm() {
  console.log("init()");

  // const url = new URL("./wasm_worker.js", import.meta.url);
  // console.log("url: %o", url);

  // let worker = new Worker(new URL("./wasm_worker.js", import.meta.url), {
  //   type: "module",
  // });

  // console.log("worker: %o", worker);

  // const content = `importScripts("./wasm-worker.js");`;
  // const workerUrl = URL.createObjectURL(new Blob([content], { type: "text/javascript" }));
  // const worker = new Worker(workerUrl);

  let worker = new Worker(new URL("./wasm_worker.js", import.meta.url), {
    type: "module",
  });

  const handlers: PrfsHandlers = await (
    Comlink.wrap(
      worker
      // new Worker(new URL("./wasm_worker.js", import.meta.url), {
      //   type: "module",
      // })
    ) as any
  ).handlers;

  if (!handlers) {
    console.log("handlers not found");
    throw new Error("handler not found");
  }

  return handlers;
}

function getWorkerURL(url: any) {
  const content = `importScripts( "${url}" );`;
  return URL.createObjectURL(new Blob([content], { type: "text/javascript" }));
}
