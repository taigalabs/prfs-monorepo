import * as fs from "fs";
import path from 'path';

/**
 * Load the wasm file and output a typescript file with the wasm bytes embedded
 */
const embedWasmBytes = async () => {
  console.log('embedWasmBytes()');

  let js = fs.readFileSync("../prfs_spartan/build/prfs_spartan.js");
  let jsStr = js.toString();

  // let initFuncHeader = 'async function init(input) {';
  // let getImportsStmt = 'const imports = getImports()';

  // let initFuncHeaderIdx = jsStr.indexOf(initFuncHeader);
  // let getImportsStmtIdx = jsStr.indexOf(getImportsStmt, initFuncHeaderIdx);

  // let str1 = jsStr.substring(0, initFuncHeaderIdx + initFuncHeader.length);
  // let str2 = jsStr.substring(initFuncHeaderIdx + initFuncHeader.length, getImportsStmtIdx);
  // let str3 = jsStr.substring(getImportsStmtIdx);

  // let str = `${str1}/*${str2}*/${str3}`;
  fs.writeFileSync("./src/wasm/wasm.js", jsStr);

  let wasm = fs.readFileSync("../prfs_spartan/build/prfs_spartan_bg.wasm");

  let bytes = new Uint8Array(wasm.buffer);

  const file = `
    export const wasmBytes = new Uint8Array([${bytes.toString()}]);
  `;

  const wasmBytesPath = path.resolve('./src/wasm/wasm_bytes.ts');
  fs.writeFileSync(wasmBytesPath, file);

  console.log('embedWasmBytes() completed, path: %s', wasmBytesPath);
};

embedWasmBytes();
