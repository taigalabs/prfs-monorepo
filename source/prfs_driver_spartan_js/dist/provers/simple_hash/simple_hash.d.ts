import { ProveArgs, ProveReceipt, VerifyArgs } from "@taigalabs/prfs-driver-interface";
import { PrfsHandlers } from "../../types";
export declare function proveSimpleHash(args: ProveArgs<SimpleHashProveArgs>, handlers: PrfsHandlers, wtnsGen: Uint8Array, circuit: Uint8Array): Promise<ProveReceipt>;
export declare function verifyMembership(args: VerifyArgs, handlers: PrfsHandlers, circuit: Uint8Array): Promise<boolean>;
export interface SimpleHashProveArgs {
    hashData: {
        msgRaw: string;
        msgRawInt: bigint;
        msgHash: bigint;
    };
}
