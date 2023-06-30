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

  function setupBtn(id: any) {
    let prfsWasm = handler["prfsWasm"];
    console.log("prfsWasm init()", prfsWasm);
    // Handlers are named in the same way as buttons.
    // let handler = handlers[id];
    // If handler doesn't exist, it's not supported.
    if (!handler) return;

    // Assign onclick handler + enable the button.
    Object.assign(document.getElementById(id) as any, {
      async onclick() {
        await prfsWasm.prove();
        // let a = await prfsWasm.default(
        //   "http://localhost:4010/circuits/prfs_wasm_bg.wasm"
        // );
        // console.log(22, a);
      },
      disabled: false
    });
  }

  // console.log("init exiting single");
  setupBtn("singleThread");
  // if (handlers.supportsThreads) {
  //   console.log("init exiting multi");

  //   setupBtn("multiThread");
  // }
}

export default init;
