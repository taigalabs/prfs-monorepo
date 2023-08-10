export * from "./helpers/public_input";
export * from "./types";

import { CircuitDriver, CircuitDriverGen } from "@taigalabs/prfs-driver-interface";
import { SpartanCircomDriverProperties } from "@taigalabs/prfs-driver-type/bindings/SpartanCircomDriverProperties";

import SpartanDriver from "./driver";
import { initWasm } from "./wasm_wrapper/load_worker";
import { fetchCircuit } from "./helpers/utils";

const spartanDriverGen: CircuitDriverGen = {
  async newInstance(driverProps: SpartanCircomDriverProperties): Promise<CircuitDriver> {
    const prfsHandlers = await initWasm();

    const circuit = await fetchCircuit(driverProps.circuit_url);

    const args = {
      handlers: prfsHandlers,
      wtnsGenUrl: driverProps.wtns_gen_url,
      circuit,
    };

    const obj = new SpartanDriver(args);
    return obj;
  },
};

export default spartanDriverGen;
