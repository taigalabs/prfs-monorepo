import * as Comlink from "comlink";
import path from 'path';
import { Worker } from 'worker_threads';
import nodeAdaptor from "comlink/node-adapter";

export async function initWasm() {
  console.log("init()");

  console.log(55, nodeAdaptor);

  let filename = path.resolve(__dirname, './wasm_worker.js');

  // const handlers = await (
  //   Comlink.wrap(
  //     new Worker(filename, {
  //       type: "module"
  //     })
  //   ) as any
  // ).handlers;

  // if (!handlers) {
  //   console.log("handlers not found");
  //   return;
  // }

  // return handlers;
}
