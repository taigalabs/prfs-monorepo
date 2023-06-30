import * as Comlink from "comlink";

async function init() {
  console.log("init()");

  const wrapped = (
    Comlink.wrap(
      new Worker(new URL("./wasm-worker.js", import.meta.url), {
        type: "module"
      })
    ) as any
  );

  const handler = wrapped.handler;
  await handler;

  if (!handler) return;

  console.log("init() 22", handler);
  console.log("init() 33", handler.supportsThreads);

  let prfs = handler["prfs"];
  console.log("prfsWasm init()", prfs);

  return prfs;
}

export default init;
