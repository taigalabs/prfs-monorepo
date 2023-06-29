import { threads } from "wasm-feature-detect";
import * as Comlink from "comlink";

console.log("wasm-worker.js");

// Wrap wasm-bindgen exports (the `generate` function) to add time measurement.
function wrapExports({ generate }) {
  console.log("wasm-worker, wrapExports()");

  return ({ width, height, maxIterations }) => {
    const start = performance.now();
    const rawImageData = generate(width, height, maxIterations);
    const time = performance.now() - start;
    return {
      // Little perf boost to transfer data to the main thread w/o copying.
      rawImageData: Comlink.transfer(rawImageData, [rawImageData.buffer]),
      time,
    };
  };
}

// function wrapExports2({ prove }) {
//   console.log("wasm-worker, wrapExports()");

//   return ({ width, height, maxIterations }) => {
//     const start = performance.now();
//     const rawImageData = generate(width, height, maxIterations);
//     const time = performance.now() - start;
//     return {
//       // Little perf boost to transfer data to the main thread w/o copying.
//       rawImageData: Comlink.transfer(rawImageData, [rawImageData.buffer]),
//       time,
//     };
//   };
// }

async function initHandlers() {
  console.log("wasm-worker, initHandlers()");

  // let [singleThread, multiThread] = await Promise.all([
  //   (async () => {
  //     const singleThread = await import("./pkg/wasm_bindgen_rayon_demo.js");
  //     await singleThread.default();
  //     return wrapExports(singleThread);
  //   })(),
  //   (async () => {
  //     console.log("initHandlers(): importing multi");
  //     // If threads are unsupported in this browser, skip this handler.
  //     if (!(await threads())) return;
  //     const multiThread = await import(
  //       "./pkg-parallel/wasm_bindgen_rayon_demo.js"
  //     );

  //     console.log("initHandlers(): multiThreadImported");
  //     await multiThread.default();
  //     await multiThread.initThreadPool(navigator.hardwareConcurrency);
  //     return wrapExports(multiThread);
  //   })(),
  // ]);

  let multiThread = await Promise.resolve(
    (async () => {
      console.log("initHandlers(): importing multi");
      // If threads are unsupported in this browser, skip this handler.
      if (!(await threads())) return;
      const multiThread = await import(
        "./pkg-parallel/wasm_bindgen_rayon_demo.js"
      );

      console.log("initHandlers(): multiThreadImported");
      await multiThread.default();
      await multiThread.initThreadPool(navigator.hardwareConcurrency);
      // return wrapExports(multiThread);
      return multiThread;
    })(),
  );

  return Comlink.proxy({
    // singleThread,
    supportsThreads: !!multiThread,
    multiThread,
  });
}

Comlink.expose({
  handlers: initHandlers(),
});
