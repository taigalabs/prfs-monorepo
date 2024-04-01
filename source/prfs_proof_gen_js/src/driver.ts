import { CircuitDriver, DriverEventListener } from "@taigalabs/prfs-driver-interface";
import { CircuitDriverId } from "@taigalabs/prfs-driver-interface/bindings/CircuitDriverId";
import { O1jsDriverProperties } from "@taigalabs/prfs-driver-o1js";
import { SpartanCircomDriverProperties } from "@taigalabs/prfs-driver-interface/bindings/SpartanCircomDriverProperties";

export async function initCircuitDriver(
  driverId: CircuitDriverId,
  driverProps: Record<string, any>,
  eventListener: DriverEventListener,
): Promise<CircuitDriver | null> {
  switch (driverId) {
    case "spartan_circom_v1": {
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
