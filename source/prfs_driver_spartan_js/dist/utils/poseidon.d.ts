/// <reference types="node" />
import { PrfsHandlers } from "../types";
export declare class Poseidon {
    handlers: PrfsHandlers;
    constructor(handlers: PrfsHandlers);
    hash(inputs: bigint[]): Promise<bigint>;
    hashPubKey(pubKey: Buffer): Promise<bigint>;
}
export declare function makePoseidon(handlers: PrfsHandlers): (inputs: bigint[]) => Promise<bigint>;
export declare function makePoseidonPubKey(handlers: PrfsHandlers): (pubKey: Buffer) => Promise<bigint>;
