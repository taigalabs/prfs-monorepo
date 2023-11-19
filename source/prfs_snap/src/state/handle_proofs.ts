import type { OnRpcRequestHandler } from "@metamask/snaps-sdk";
import { copyable, divider, heading, panel, text } from "@metamask/snaps-ui";
import { PrfsProofSnapItem } from "@taigalabs/prfs-entities/bindings/PrfsProofSnapItem";

import { clearState, getState, setState } from "./utils";

export const addProof: OnRpcRequestHandler = async ({ request }) => {
  const params = request.params as any;
  console.log("add_proof", params);

  const proof = params.proof as PrfsProofSnapItem;

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

  let elems = [];
  for (const proof of state.proofs) {
    elems = [...elems, text(proof.proof_label), copyable(proof.proof_short_url)];
  }

  snap.request({
    method: "snap_dialog",
    params: {
      type: "confirmation",
      content: panel([heading("Proofs"), ...elems]),
    },
  });

  return state as any;
};
