// import * as wasm from "./prfs_wasm";

// import { wasmBytes } from "./prfs_wasm_bytes";
//
//
// import wasm from "../wasm_build/prfs_wasm";

export const init = async () => {
  console.log("prfs_wasm_embed init() 111");
  const worker = new Worker(new URL("./worker.js?module", import.meta.url), {
    type: "module"
  });

  // fetch("/pkg/synchronous_instantiation_bg.wasm")
  //   .then(response => response.arrayBuffer())
  //   .then(bytes => {
  //     worker.postMessage(bytes, [bytes]);
  //   });

  worker.onmessage = ({ data }) => {
    console.log(22, data);
    // const { type } = data;

    // switch (type) {
    //   case "FETCH_WASM": {
    //     /**
    //      * The worker wants to fetch the bytes for the module and for that we can use the `fetch` API.
    //      * Then we convert the response into an `ArrayBuffer` and transfer the bytes back to the worker.
    //      *
    //      * @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
    //      * @see https://developer.mozilla.org/en-US/docs/Glossary/Transferable_objects
    //      */
    //     fetch("/pkg/synchronous_instantiation_bg.wasm")
    //       .then(response => response.arrayBuffer())
    //       .then(bytes => {
    //         worker.postMessage(bytes, [bytes]);
    //       });
    //     break;
    //   }
    //   default: {
    //     break;
    //   }
    // }
  };
  // let wsm = wasm();
  // console.log(22, wsm);
  //
  // const aa = await import("../wasm_build/prfs_wasm");
  // const { add_one: addOne } = exports;

  // let a = await import("../wasm_build/prfs_wasm");
  // console.log(1, aa);
  // let a = await fetch('http://localhost:4010/circuits/build/prfs_wasm.js');
  // console.log(22, a);

  // wasm.initSync(wasmBytes.buffer);
  // wasm.init_panic_hook();
  //
  // await wasm.default('http://localhost:4010/circuits/addr_membership2.wasm');
};

// export default wasm;
