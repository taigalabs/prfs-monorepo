// @ts-ignore
const snarkJs = require("snarkjs");
export const snarkJsWitnessGen = async (input, wasmFile) => {
    const witness = {
        type: "mem",
    };
    await snarkJs.wtns.calculate(input, wasmFile, witness);
    return witness;
};
