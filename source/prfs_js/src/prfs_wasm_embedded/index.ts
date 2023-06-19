import * as wasm from "./prfs_wasm";

import { wasmBytes } from "./prfs_wasm_bytes";

export const init = async () => {
  console.log('prfs_wasm_embed init()');

  await wasm.initSync(wasmBytes.buffer);
  wasm.init_panic_hook();
};

export default wasm;
