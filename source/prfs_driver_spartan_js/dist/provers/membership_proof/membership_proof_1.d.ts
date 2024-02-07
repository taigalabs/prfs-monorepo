import { ProveArgs, ProveReceipt, VerifyArgs } from "@taigalabs/prfs-driver-interface";
import { MembershipProveInputs } from "@taigalabs/prfs-circuit-interface";
import { PrfsHandlers } from "../../types";
export declare function proveMembership(args: ProveArgs<MembershipProveInputs>, handlers: PrfsHandlers, wtnsGen: Uint8Array, circuit: Uint8Array): Promise<ProveReceipt>;
export declare function verifyMembership(args: VerifyArgs, handlers: PrfsHandlers, circuit: Uint8Array): Promise<boolean>;
