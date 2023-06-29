/*
 * Copyright 2022 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as Comlink from "comlink";


async function init() {
  console.log('init()');

  const maxIterations = 1000;

  const canvas = document.getElementById("canvas") as any;
  const { width, height } = canvas;
  const ctx = canvas.getContext("2d") as any;
  const timeOutput = document.getElementById("time") as any;

  // Create a separate thread from wasm-worker.js and get a proxy to its handlers.
  let handlers = (await Comlink.wrap(
    new Worker(new URL("./wasm-worker.ts", import.meta.url), {
      type: "module",
    })
  ) as any).handlers;

  console.log("init() 22", handlers);
  console.log("init() 33", await handlers.supportsThreads);

  function setupBtn(id: any) {
    // Handlers are named in the same way as buttons.
    let handler = handlers[id];
    // If handler doesn't exist, it's not supported.
    if (!handler) return;
    // Assign onclick handler + enable the button.
    Object.assign(document.getElementById(id), {
      async onclick() {
        let { rawImageData, time } = await handler({
          width,
          height,
          maxIterations,
        });
        timeOutput.value = `${time.toFixed(2)} ms`;
        const imgData = new ImageData(rawImageData, width, height);
        ctx.putImageData(imgData, 0, 0);
      },
      disabled: false,
    });
  }

  setupBtn("singleThread");
  if (await handlers.supportsThreads) {
    console.log(123123);
    setupBtn("multiThread");
  }
};

export default init;
