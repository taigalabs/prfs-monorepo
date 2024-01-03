export declare function bnToBuf(bn: bigint): Uint8Array;
export declare function stringToBigInt(str: string): bigint;
export declare const bytesToBigInt: (bytes: Uint8Array) => bigint;
export declare const bytesLeToBigInt: (bytes: Uint8Array) => bigint;
export declare const bigIntToBytes: (n: bigint, size: number) => Uint8Array;
export declare const bigIntToLeBytes: (n: bigint, size: number) => Uint8Array;
export declare function numToUint8Array(num: number): Uint8Array;
export declare function uint8ArrayToNum(arr: Uint8Array): number;
