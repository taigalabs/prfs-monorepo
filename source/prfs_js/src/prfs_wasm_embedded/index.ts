import * as wasm from "./prfs_wasm";

import { wasmBytes } from "./prfs_wasm_bytes";

export const init = async () => {
  console.log('prfs_wasm_embed init()');

  wasm.initSync(wasmBytes.buffer);
  wasm.init_panic_hook();
  //
  // await wasm.default('http://localhost:4010/circuits/addr_membership2.wasm');

};

export default wasm;
