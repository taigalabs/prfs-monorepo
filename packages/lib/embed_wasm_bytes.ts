import * as fs from "fs";

/**
 * Load the wasm file and output a typescript file with the wasm bytes embedded
 */
const embedWasmBytes = async () => {
  console.log('embedWasmBytes()');

  let js = fs.readFileSync("../spartan_wasm/build/spartan_wasm.js");
  let jsStr = js.toString();

  let initFuncHeader = 'async function init(input) {';
  let getImportsStmt = 'const imports = getImports()';
  let a = jsStr.indexOf(initFuncHeader);
  let b = jsStr.indexOf(getImportsStmt, a);
  console.log(222, a);
  console.log(111, b);

  let str1 = jsStr.substring(0, a + initFuncHeader.length);
  let str2 = jsStr.substring(a + initFuncHeader.length, b);
  let str3 = jsStr.substring(b);

  console.log(44, str1);
  console.log(55, str2);
  console.log(66, str3);


  let str = `${str1}/*${str2}*/${str3}`;
  console.log(333, str);
  fs.writeFileSync("./src/wasm/wasm.js", str);

  let wasm = fs.readFileSync("../spartan_wasm/build/spartan_wasm_bg.wasm");

  let bytes = new Uint8Array(wasm.buffer);

  const file = `
    export const wasmBytes = new Uint8Array([${bytes.toString()}]);
  `;

  fs.writeFileSync("./src/wasm/wasm_bytes.ts", file);
};

console.log(22222222);

embedWasmBytes();
