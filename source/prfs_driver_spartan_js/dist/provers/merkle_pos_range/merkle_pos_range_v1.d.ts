import { ProveArgs, ProveReceipt, VerifyArgs } from "@taigalabs/prfs-driver-interface";
import { SpartanMerkleProof } from "@taigalabs/prfs-circuit-interface";
import { PrfsHandlers } from "../../types";
export declare function proveMembership(args: ProveArgs<MerklePosRangeInputs>, handlers: PrfsHandlers, wtnsGen: Uint8Array, circuit: Uint8Array): Promise<ProveReceipt>;
export declare function verifyMembership(args: VerifyArgs, handlers: PrfsHandlers, circuit: Uint8Array): Promise<boolean>;
export interface MerklePosRangeInputs {
    leaf: string;
    merkleProof: SpartanMerkleProof;
}
