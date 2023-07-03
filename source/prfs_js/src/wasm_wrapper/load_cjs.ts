import * as Comlink from "comlink";
import path from 'path';
import { Worker } from 'worker_threads';
import nodeEndpoint from "comlink/dist/umd/node-adapter";

export async function initWasm() {
  console.log("init()");

  let filename = path.resolve(__dirname, './wasm_worker.js');
  let worker = new Worker(filename);

  // const handlers = await (
  //   Comlink.wrap(nodeEndpoint(worker))
  // ).handlers;

  // console.log(5, handlers);

  // if (!handlers) {
  //   console.log("handlers not found");
  //   return;
  // }

  // return handlers;
}
