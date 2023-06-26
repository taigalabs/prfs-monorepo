import wasm from "../wasm_build/prfs_wasm";

let subscribers: Function[] = [];

export const initWasm = async () => {
  console.log("prfs_wasm_embed init()");

  let a = await wasm();
  console.log(22, a);

  // let res = await fetch("http://localhost:4010/circuits/prfs_wasm_bg.wasm");
  // let wasm_bytes = await res.arrayBuffer();

  // let promise = new Promise((resolve, reject) => {
  //   const worker = new Worker(new URL("./worker.js?module", import.meta.url), {
  //     type: "module"
  //   });

  //   worker.onmessage = async ({ data }) => {
  //     console.log(22, data);

  //     const { kind, payload } = data;
  //     switch (kind) {
  //       case "LOAD_SUCCESS": {
  //         try {
  //           let res = await fetch("http://localhost:4010/circuits/prfs_wasm_bg.wasm");
  //           let wasm_bytes = await res.arrayBuffer();
  //           console.log('wasm_bytes, ', wasm_bytes);

  //           worker.postMessage({
  //             kind: 'INIT_WASM',
  //             payload: wasm_bytes,
  //           });
  //         } catch (err) {
  //           console.error(err);
  //         }
  //         break;
  //       }
  //       case "INIT_WASM_SUCCESS": {
  //         console.log(123123);

  //         resolve(0);

  //         break;
  //       }
  //       case "EXEC_RESULT": {
  //         for (let listener of subscribers) {
  //           listener(payload);
  //         }
  //         break;
  //       }
  //       default: {
  //         break;
  //       }
  //     }
  //   };
  // });

  // await promise;
};

export function callProve() {

}

export function subscribe(listener: Function) {
  subscribers.push(listener);
}

