import { CircuitDriver, DriverEventListener } from "@taigalabs/prfs-driver-interface";
import { type SpartanCircomDriverProperties } from "@taigalabs/prfs-driver-spartan-js";

export async function initCircuitDriver(
  driverId: string,
  driverProps: Record<string, any>,
  eventListener: DriverEventListener,
): Promise<CircuitDriver> {
  switch (driverId) {
    case "SPARTAN_CIRCOM_1": {
      const mod = await import("@taigalabs/prfs-driver-spartan-js");
      const driver = await mod.default.newInstance(
        driverProps as SpartanCircomDriverProperties,
        eventListener,
      );
      return driver;
    }
    default:
      throw new Error(`This driver is not supported, ${driverId}`);
  }
}

export function interpolateSystemAssetEndpoint(
  driverProperties: Record<string, any>,
  prfsAssetEndpoint: string,
): Record<string, any> {
  const ret: Record<string, any> = {};

  for (const key in driverProperties) {
    const val = driverProperties[key];
    ret[key] = val.replace("prfs://", `${prfsAssetEndpoint}/`);
  }

  return ret;
}
