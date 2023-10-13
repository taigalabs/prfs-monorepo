export * from "./helpers/public_input";
export * from "./types";

import { CircuitDriver, CircuitDriverGen } from "@taigalabs/prfs-driver-interface";

import { SpartanCircomDriverProperties } from "./driver_props";
import SpartanDriver, { SpartanDriverCtorArgs } from "./driver";
import { initWasm } from "./wasm_wrapper/load_worker";
import { fetchAsset } from "./helpers/utils";

const spartanDriverGen: CircuitDriverGen = {
  async newInstance(driverProps: SpartanCircomDriverProperties): Promise<CircuitDriver> {
    console.log("Creating a driver instance, props: %o", driverProps);

    let prfsHandlers;
    try {
      prfsHandlers = await initWasm();

      const ts = Date.now();
      const circuit = await fetchAsset(`${driverProps.circuit_url}?version=${ts}`);
      const wtnsGen = await fetchAsset(`${driverProps.wtns_gen_url}?version=${ts}`);

      const args: SpartanDriverCtorArgs = {
        handlers: prfsHandlers,
        wtnsGen,
        circuit,
      };

      const obj = new SpartanDriver(args);
      return obj;
    } catch (err) {
      throw err;
    }
  },
};

export default spartanDriverGen;
