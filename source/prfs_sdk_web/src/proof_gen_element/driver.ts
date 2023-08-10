import { CircuitDriver } from "@taigalabs/prfs-driver-interface";
import { ProofGenElementOptions } from "./proof_gen_element";

export async function initDriver(options: ProofGenElementOptions): Promise<CircuitDriver> {
  const { proofType } = options;
  const { driver_id, driver_properties } = proofType;
  const driverProps = interpolateSystemAssetEndpoint(driver_properties, options.prfsAssetEndpoint);

  switch (driver_id) {
    case "SPARTAN_CIRCOM_1": {
      const mod = await import("@taigalabs/prfs-driver-spartan-js");

      const driver = await mod.default.newInstance(driverProps);
      return driver;
    }
    default:
      throw new Error(`This driver is not supported, ${driver_id}`);
  }
}

function interpolateSystemAssetEndpoint(
  driverProperties: Record<string, any>,
  prfsAssetEndpoint: string
): Record<string, any> {
  const ret: Record<string, any> = {};

  for (const key in driverProperties) {
    const val = driverProperties[key];
    ret[key] = val.replace("prfs:/", prfsAssetEndpoint);
  }

  return ret;
}
