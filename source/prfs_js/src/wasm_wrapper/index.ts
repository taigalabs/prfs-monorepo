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

  console.log("init() 22", handlers);

  let width = 3;
  let height = 3;
  let maxIterations = 3;

  // let { rawImageData, time } = await handlers.generate({
  //   width,
  //   height,
  //   maxIterations,
  // });

  // timeOutput.value = `${time.toFixed(2)} ms`;
  // const imgData = new ImageData(rawImageData, width, height);
  // ctx.putImageData(imgData, 0, 0);

  let b = await handlers.multiThread();
  console.log(111, b);

  // let c = await handlers.poseidonHash([0, 3, 1]);
  // console.log(222, c);

  // let prfs = handler.prfs;
  // console.log("prfsWasm init()", prfs);
  // console.log("prfsWasm f()", await handler.f());

  // let a = await prfs.poseidonHash3([0]);
  // console.log("a 123", a);

  return {
    a: 3
    // b: prfs
  };
}

