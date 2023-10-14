import { ProveArgs, ProveReceipt } from "@taigalabs/prfs-driver-interface";

import { MembershipProveInputs } from "../driver";
import { PrfsHandlers } from "../types";

export function proveSimpleHash(
  args: ProveArgs<MembershipProveInputs>,
  handlers: PrfsHandlers,
  wtnsGen: Uint8Array,
  circuit: Uint8Array
): Promise<ProveReceipt> {
  console.log(5);

  return Promise.reject(1);
}
