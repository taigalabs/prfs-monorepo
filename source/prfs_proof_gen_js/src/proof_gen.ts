import {
  CircuitDriver,
  DriverEventListener,
  SPARTAN_DRIVER_V1_ID,
} from "@taigalabs/prfs-driver-interface";
import { type SpartanCircomDriverProperties } from "@taigalabs/prfs-driver-spartan-js";

export async function initCircuitDriver(
  driverId: string,
  eventListener: DriverEventListener,
  assetServerEndpoint: string,
): Promise<CircuitDriver> {
  switch (driverId) {
    case SPARTAN_DRIVER_V1_ID: {
      const mod = await import("@taigalabs/prfs-driver-spartan-js");
      const driverProps: SpartanCircomDriverProperties = {};
      const driver = await mod.default.newInstance(
        driverProps as SprtanCircomDriverProperties,
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
