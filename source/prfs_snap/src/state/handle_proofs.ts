import type { OnRpcRequestHandler } from "@metamask/snaps-sdk";
import { copyable, divider, heading, panel, text } from "@metamask/snaps-ui";

import { PrfsProof } from "./types";
import { clearState, getState, setState } from "./utils";

export const addProof: OnRpcRequestHandler = async ({ request }) => {
  const params = request.params as any;
  console.log("add_proof", params);

  const proof = params.proof as PrfsProof;

  if (proof) {
    const oldState = await getState();
    const newState = { ...oldState };
    console.log("state", newState);

    // Might happen when we change the interface of 'State'
    if (!newState.proofs) {
      console.log("Looks like State interface might have changed, resetting...");
      newState.proofs = [];
    }

    if (newState.proofs.length > 9) {
      newState.proofs.shift();
    }

    newState.proofs.push(proof);

    await setState({ proofs: newState.proofs }, params.encrypted);
  }
  return true;
};

export const getProofs: OnRpcRequestHandler = async ({ request }) => {
  const params = request.params as any;

  const state = await getState(params?.encrypted);
  console.log("state", state);

  snap.request({
    method: "snap_dialog",
    params: {
      type: "confirmation",
      content: panel([heading("power"), text(`12312`), divider(), copyable("1313")]),
    },
  });

  return state as any;
};
