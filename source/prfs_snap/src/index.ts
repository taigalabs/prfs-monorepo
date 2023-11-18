import type { OnRpcRequestHandler } from "@metamask/snaps-types";
import { copyable, divider, heading, image, panel, text } from "@metamask/snaps-ui";
import { addProof, getProofs } from "./state/handle_proofs";
import { AddProofParams, BaseParams } from "./state/types";
import { clearState, getState, setState } from "./state/utils";

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
  console.log("rpc request, method: %s", request.method);

  switch (request.method) {
    case "hello":
      return snap.request({
        method: "snap_dialog",
        params: {
          type: "confirmation",
          content: panel([
            text(`Hello, **${origin}**!`),
            text("This custom confirmation is just for display purposes."),
            text("But you can edit the snap source code to make it do something, if you want to!"),
          ]),
        },
      });

    case "add_proof": {
      return await addProof({ origin, request });
    }

    case "get_proofs": {
      return await getProofs({ origin, request });
    }

    case "clear_proofs": {
      const params = request.params as BaseParams;
      await clearState(params?.encrypted);
      return true;
    }

    default:
      throw new Error("Method not found.");
  }
};
