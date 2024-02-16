import { DriverEventListener } from "@taigalabs/prfs-driver-interface";
export declare function fetchAsset(assetName: string, url: string, eventListener: DriverEventListener): Promise<Uint8Array>;
