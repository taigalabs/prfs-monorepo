export * from "./types";
export * from "./helpers/public_input";
export * from "./core/membership_prover2";
export * from "./core/membership_verifier";
export * from "./helpers/tree";
export * from "./helpers/poseidon";
import { initWasm } from "./wasm_wrapper";
export * from "./config";

//
export * from "./core/membership_prover2";

export async function init() {
  await initWasm();
}
