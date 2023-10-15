import { CircuitDriver } from "@taigalabs/prfs-driver-interface";
import { SpartanCircomDriverProperties } from "@taigalabs/prfs-driver-spartan-js/build/driver";

export async function initDriver(
  driverId: string,
  driverProps: Record<string, any>
): Promise<CircuitDriver> {
  switch (driverId) {
    case "SPARTAN_CIRCOM_1": {
      const mod = await import("@taigalabs/prfs-driver-spartan-js");
      const driver = await mod.default.newInstance(driverProps as SpartanCircomDriverProperties);
      return driver;
    }
    default:
      throw new Error(`This driver is not supported, ${driverId}`);
  }
}

export function interpolateSystemAssetEndpoint(
  driverProperties: Record<string, any>,
  prfsAssetEndpoint: string
): Record<string, any> {
  const ret: Record<string, any> = {};

  for (const key in driverProperties) {
    const val = driverProperties[key];
    ret[key] = val.replace("prfs://", `${prfsAssetEndpoint}/`);
  }

  return ret;
}
