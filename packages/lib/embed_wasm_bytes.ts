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

  let initFuncHeaderIdx = jsStr.indexOf(initFuncHeader);
  let getImportsStmtIdx = jsStr.indexOf(getImportsStmt, initFuncHeaderIdx);

  console.log(1, initFuncHeaderIdx);
  console.log(2, getImportsStmtIdx);

  let str1 = jsStr.substring(0, initFuncHeaderIdx + initFuncHeader.length);
  let str2 = jsStr.substring(initFuncHeaderIdx + initFuncHeader.length, getImportsStmtIdx);
  let str3 = jsStr.substring(getImportsStmtIdx);

  let str = `${str1}/*${str2}*/${str3}`;
  fs.writeFileSync("./src/wasm/wasm.js", str);

  let wasm = fs.readFileSync("../spartan_wasm/build/spartan_wasm_bg.wasm");

  let bytes = new Uint8Array(wasm.buffer);

  const file = `
    export const wasmBytes = new Uint8Array([${bytes.toString()}]);
  `;

  fs.writeFileSync("./src/wasm/wasm_bytes.ts", file);
};

embedWasmBytes();
