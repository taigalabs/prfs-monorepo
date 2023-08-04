export async function launchDriver(driverId: string, driverProps: Record<string, any>) {
  switch (driverId) {
    case "SPARTAN_CIRCOM_1": {
      const mod = await import("@taigalabs/prfs-driver-spartan-js");
      return mod;
    }
    default:
      throw new Error(`This driver is not supported, ${driverId}`);
  }
}
