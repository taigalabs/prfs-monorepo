import * as Comlink from "comlink";

async function init() {
  console.log("init()");

  let handler = (
    Comlink.wrap(
      new Worker(new URL("./wasm-worker.js", import.meta.url), {
        type: "module"
      })
    ) as any
  ).handler;

  console.log("init() 22", handler);
  console.log("init() 33", handler.supportsThreads);

  if (!handler) return;

  await handler;

  let prfsWasm = handler["prfsWasm"];
  console.log("prfsWasm init()", prfsWasm);

  return prfsWasm;
}

export default init;
