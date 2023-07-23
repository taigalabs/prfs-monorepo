export interface Envs {
  NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT: string;
  NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT: string;
  IS_TEASER: string;
}

export function getAddrMembership2CircuitUrl() {
  if (process.env.NEXT_PUBLIC_ADDR_MEMBERSHIP_TEMP_CIRCUIT_URL === undefined) {
    throw new Error("addr membership2 circuit url is needed");
  }
  return process.env.NEXT_PUBLIC_ADDR_MEMBERSHIP_TEMP_CIRCUIT_URL;
}

export function getAddrMembership2WtnsGenUrl() {
  if (process.env.NEXT_PUBLIC_ADDR_MEMBERSHIP_TEMP_WTNS_GEN_URL === undefined) {
    throw new Error("addr membership2 wtns gen url is needed");
  }
  return process.env.NEXT_PUBLIC_ADDR_MEMBERSHIP_TEMP_WTNS_GEN_URL;
}
