// @ts-ignore
const snarkJs = require("snarkjs");
export const snarkJsWitnessGen = async (input: any, wasmFile: string | Uint8Array) => {
  const witness: {
    type: string;
    data?: any;
  } = {
    type: "mem",
  };

  await snarkJs.wtns.calculate(input, wasmFile, witness);
  return witness;
};
