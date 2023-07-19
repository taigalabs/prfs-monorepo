import * as Comlink from "comlink";

import { PrfsHandlers } from "../types";

export async function initWasm() {
  console.log("init()");

  // const blob = new Blob([inline], { type: "text/javascript" });
  // let a = URL.createObjectURL(blob);
  // let b = new Worker(a, {
  //   type: "module",
  // });
  // console.log(b);
  const url = new URL("./wasm_worker.js", import.meta.url);
  console.log("url: %o", url);

  let worker = new Worker(new URL("./wasm_worker.js", import.meta.url), {
    type: "module",
  });

  console.log("worker: %o", worker);

  const handlers: PrfsHandlers = await (
    Comlink.wrap(
      new Worker(new URL("./wasm_worker.js", import.meta.url), {
        type: "module",
      })
    ) as any
  ).handlers;

  if (!handlers) {
    console.log("handlers not found");
    throw new Error("handler not found");
  }

  return handlers;
}
