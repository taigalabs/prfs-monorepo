import { CircuitDriver } from "@taigalabs/prfs-driver-interface";

// export async function initDriver(
//   driverId: string,
//   driverProps: Record<string, any>
// ): Promise<CircuitDriver> {
//   switch (driverId) {
//     case "SPARTAN_CIRCOM_1": {
//       const mod = await import("@taigalabs/prfs-driver-spartan-js");
//       const driver = await mod.default.newInstance(driverProps);
//       return driver;
//     }
//     default:
//       throw new Error(`This driver is not supported, ${driverId}`);
//   }
// }

// export function interpolateSystemAssetEndpoint(
//   driverProperties: Record<string, any>
// ): Record<string, any> {
//   const ret: Record<string, any> = {};

//   for (const key in driverProperties) {
//     const val = driverProperties[key];
//     ret[key] = val.replace("prfs:/", process.env.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT);
//   }

//   return ret;
// }
