export * from "./helpers/public_input";
export * from "./types";

import { CircuitDriver, CircuitDriverInstance } from "@taigalabs/prfs-driver-interface";
import { SpartanCircomDriverProperties } from "@taigalabs/prfs-driver-type/bindings/SpartanCircomDriverProperties";

import SpartanDriver from "./driver";
import { initWasm } from "./wasm_wrapper/load_worker";

const driver: CircuitDriver = {
  async newInstance(driverProps: SpartanCircomDriverProperties): Promise<CircuitDriverInstance> {
    let prfsHandlers = await initWasm();

    const obj = new SpartanDriver(prfsHandlers, driverProps);
    return obj;
  },
};

export default driver;
