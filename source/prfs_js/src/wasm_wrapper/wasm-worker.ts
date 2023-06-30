import { threads } from "wasm-feature-detect";
import * as Comlink from "comlink";

async function initHandlers() {
  console.log("wasm-worker, initHandlers()");

  // let [singleThread, multiThread] = await Promise.resolve([
  //   (async () => {
  //     console.log("initHandlers(): importing single");

  //     const singleThread = await import(
  //       "../../demo/pkg/wasm_bindgen_rayon_demo.js"
  //     );
  //     await singleThread.default();
  //     return wrapExports(singleThread);
  //   })(),
  //   (async () => {
  //     console.log("initHandlers(): importing multi");

  //     // If threads are unsupported in this browser, skip this handler.
  //     if (!(await threads())) return;
  //     const multiThread = await import(
  //       "../../demo/pkg-parallel/wasm_bindgen_rayon_demo.js"
  //     );

  //     console.log("initHandlers(): multiThreadImported");

  //     await multiThread.default();
  //     await multiThread.initThreadPool(navigator.hardwareConcurrency);
  //     return wrapExports(multiThread);
  //   })()
  // ]);

  console.log("initHandlers(): importing multi");

  // If threads are unsupported in this browser, skip this handler.
  if (!(await threads())) return;
  const multiThread = await import("../wasm_build/build/prfs_wasm");

  console.log("initHandlers(): multiThreadImported");

  // await multiThread.default();
  // await multiThread.initThreadPool(navigator.hardwareConcurrency);
  // return wrapExports(multiThread);

  console.log("multithread", !!multiThread);

  return Comlink.proxy({
    // singleThread,
    supportsThreads: !!multiThread,
    multiThread
  });
}

const handlers = await initHandlers();

console.log(55);

Comlink.expose({
  handlers
});

export default () => {};
