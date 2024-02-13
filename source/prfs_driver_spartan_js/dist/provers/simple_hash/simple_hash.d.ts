import { ProveArgs, ProveReceipt, VerifyArgs } from "@taigalabs/prfs-driver-interface";
import { SimpleHashV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/SimpleHashV1Inputs";
import { PrfsHandlers } from "../../types";
export declare function proveSimpleHash(args: ProveArgs<SimpleHashV1Inputs>, handlers: PrfsHandlers, wtnsGen: Uint8Array, circuit: Uint8Array): Promise<ProveReceipt>;
export declare function verifyMembership(args: VerifyArgs, handlers: PrfsHandlers, circuit: Uint8Array): Promise<boolean>;
