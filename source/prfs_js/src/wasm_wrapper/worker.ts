import * as wasm from "../wasm_build/prfs_wasm";

self.onmessage = ({ data }) => {
  const { kind, payload } = data;

  switch (kind) {
    case "INIT_WASM": {
      wasm.initSync(payload);

      self.postMessage({ type: "INIT_WASM_SUCCESS" });
      break;
    }
    default: {
      break;
    }
  }
};

self.postMessage({ kind: "FETCH_WASM" });
