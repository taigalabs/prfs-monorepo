import {
  CircuitDriver,
  DriverEventListener,
  SPARTAN_CIRCOM_V1,
} from "@taigalabs/prfs-driver-interface";
import { O1jsDriverProperties } from "@taigalabs/prfs-driver-o1js";
import { SpartanCircomDriverProperties } from "@taigalabs/prfs-driver-spartan-js";

export async function initCircuitDriver(
  driverId: string,
  driverProps: Record<string, any>,
  eventListener: DriverEventListener,
): Promise<CircuitDriver> {
  switch (driverId) {
    case SPARTAN_CIRCOM_V1: {
      const mod = await import("@taigalabs/prfs-driver-spartan-js");

      const driver = await mod.default.newInstance(
        driverProps as SpartanCircomDriverProperties,
        eventListener,
      );
      return driver;
    }
    case "o1js_v1": {
      const mod = await import("@taigalabs/prfs-driver-o1js");

      const driver = await mod.default.newInstance(
        driverProps as O1jsDriverProperties,
        eventListener,
      );
      return driver;
    }
    default:
      throw new Error(`This driver is not supported, ${driverId}`);
  }
}
