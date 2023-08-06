export * from "./helpers/public_input";
export * from "./types";

import { CircuitDriver, CircuitDriverGen } from "@taigalabs/prfs-driver-interface";
import { SpartanCircomDriverProperties } from "@taigalabs/prfs-driver-type/bindings/SpartanCircomDriverProperties";

import SpartanDriver from "./driver";
import { initWasm } from "./wasm_wrapper/load_worker";

const spartanDriverGen: CircuitDriverGen = {
  async newInstance(driverProps: SpartanCircomDriverProperties): Promise<CircuitDriver> {
    let prfsHandlers = await initWasm();

    const obj = new SpartanDriver(prfsHandlers, driverProps);
    return obj;
  },
};

export default spartanDriverGen;
