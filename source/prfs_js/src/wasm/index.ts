import * as wasm from "./wasm";

import { wasmBytes } from "./wasm_bytes";

export const init = async () => {
  console.log('wasm/init()');

  await wasm.initSync(wasmBytes.buffer);
  wasm.init_panic_hook();
};

export default wasm;
