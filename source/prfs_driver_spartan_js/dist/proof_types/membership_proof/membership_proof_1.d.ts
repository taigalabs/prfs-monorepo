import { ProveArgs, ProveResult, VerifyArgs } from "@taigalabs/prfs-driver-interface";
import { AddrMembershipV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/AddrMembershipV1Inputs";
import { PrfsHandlers } from "../../types";
export declare function proveMembership(args: ProveArgs<AddrMembershipV1Inputs>, handlers: PrfsHandlers, wtnsGen: Uint8Array, circuit: Uint8Array): Promise<ProveResult>;
export declare function verifyMembership(args: VerifyArgs, handlers: PrfsHandlers, circuit: Uint8Array): Promise<boolean>;
