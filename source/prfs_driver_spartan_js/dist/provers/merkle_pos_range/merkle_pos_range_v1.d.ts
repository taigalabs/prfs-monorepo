import { ProveArgs, ProveReceipt, VerifyArgs } from "@taigalabs/prfs-driver-interface";
import { MerklePosRangeInputs } from "@taigalabs/prfs-circuit-interface";
import { PrfsHandlers } from "@/types";
export declare function proveMembership(args: ProveArgs<MerklePosRangeInputs>, handlers: PrfsHandlers, wtnsGen: Uint8Array, circuit: Uint8Array): Promise<ProveReceipt>;
export declare function verifyMembership(args: VerifyArgs, handlers: PrfsHandlers, circuit: Uint8Array): Promise<boolean>;
