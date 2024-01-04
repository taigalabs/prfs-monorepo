import { DriverEventListener } from "@taigalabs/prfs-driver-interface";
export declare const snarkJsWitnessGen: (input: any, wasmFile: string | Uint8Array) => Promise<{
    type: string;
    data?: any;
}>;
export declare function fetchAsset(assetName: string, url: string, eventListener: DriverEventListener): Promise<Uint8Array>;
export declare const fromSig: (sig: string) => {
    r: bigint;
    s: bigint;
    v: bigint;
};
