export * from "./helpers/public_input";
export * from "./types";
export * from "./properties";

import SpartanDriver from "./prfs";

export async function newInstance() {
  return await SpartanDriver.newInstance();
}
