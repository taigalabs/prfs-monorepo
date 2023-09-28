import { CircuitDriver } from "@taigalabs/prfs-driver-interface";

export async function initDriver(
  driverId: string,
  driverProps: Record<string, any>
): Promise<CircuitDriver> {
  switch (driverId) {
    case "SPARTAN_CIRCOM_1": {
      console.log("initDriver()");

      // const { newInstance } = window.prfsDriverSpartanJs;
      // console.log(333, a);

      try {
        console.log(222);
        const mod = await import("@taigalabs/prfs-driver-spartan-js");
        // const mod = await import(
        //   /* webpackIgnore: true */ `http://localhost:4010/assets/drivers/bundle.js?now=${Date.now()}`
        // );

        console.log(22, mod);

        const driver = await mod.default.newInstance(driverProps);
        // const driver = await newInstance(driverProps);
        return driver;
      } catch (err) {
        console.error(err);
      }
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

declare global {
  interface Window {
    prfsDriverSpartanJs: any;
  }
}
