// import * as wasm from "./prfs_wasm";

// import { wasmBytes } from "./prfs_wasm_bytes";
//
// import wasm from "../wasm_build/prfs_wasm";
let subscribers: Function[] = [];

export const init = async () => {
  console.log("prfs_wasm_embed init()");

  let res = await fetch("http://localhost:4010/circuits/prfs_wasm_bg.wasm");
  let wasm_bytes = await res.arrayBuffer();

  worker.postMessage({
    kind: 'INIT_WASM',
    payload: [wasm_bytes],
  });

};

export function callProve() {

}

export function subscribe(listener: Function) {
  subscribers.push(listener);
}

const worker = new Worker(new URL("./worker.js?module", import.meta.url), {
  type: "module"
});

worker.onmessage = async ({ data }) => {
  console.log(22, data);

  const { kind, payload } = data;
  switch (kind) {
    case "FETCH_WASM": {
      try {
        let res = await fetch("http://localhost:4010/circuits/prfs_wasm_bg.wasm");
        let wasm_bytes = await res.arrayBuffer();

        worker.postMessage({
          kind: 'INIT_WASM',
          payload: [wasm_bytes],
        });
      } catch (err) {
        console.error(err);
      }
      break;
    }
    case "INIT_WASM_SUCCESS": {
      console.log(123123);
      break;
    }
    case "EXEC_RESULT": {
      for (let listener of subscribers) {
        listener(payload);
      }
      break;
    }
    default: {
      break;
    }
  }
};
