import { ProveArgs, ProveResult, VerifyArgs } from "@taigalabs/prfs-driver-interface";
import { MerkleSigPosRangeV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Inputs";
import { bytesToNumberLE, poseidon_2_bigint_le, toUtf8Bytes } from "@taigalabs/prfs-crypto-js";
import {
  Field,
  SmartContract,
  state,
  State,
  method,
  MerkleWitness,
  CircuitString,
  Poseidon,
  Struct,
  PublicKey,
} from "o1js";

import ZkappWorkerClient from "./zkappWorkerClient";

const transactionFee = 0.1;
const ZKAPP_ADDRESS = "B62qmB49xfPPLFtZspXwNpG2gPpfNEVgNc3ZCDLZzALg8vcuTnNDgNY";

async function timeout(seconds: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

export async function proveMembership(
  args: ProveArgs<MerkleSigPosRangeV1Inputs>,
  // handlers: PrfsHandlers,
  // wtnsGen: Uint8Array,
  // circuit: Uint8Array,
): Promise<ProveResult> {
  const { inputs, eventListener } = args;
  console.log("inputs: %o", inputs);

  const {
    sigpos,
    leaf,
    merkleProof,
    assetSize,
    assetSizeLessThan,
    assetSizeGreaterEqThan,
    assetSizeLabel,
    nonceRaw,
    proofPubKey,
  } = inputs;

  // if (!state.hasBeenSetup) {
  // setDisplayText("Loading web worker...");
  console.log("Loading web worker...");
  eventListener({
    type: "CREATE_PROOF_EVENT",
    payload: { type: "info", payload: "Loading web worker" },
  });
  const zkappWorkerClient = new ZkappWorkerClient();
  await timeout(5);

  // setDisplayText("Done loading web worker");
  console.log("Done loading web worker");

  await zkappWorkerClient.setActiveInstanceToBerkeley();

  const mina = (window as any).mina;
  if (mina == null) {
    // setState({ ...state, hasWallet: false });
    throw new Error("Mina does not exist");
  }

  const publicKeyBase58: string = (await mina.requestAccounts())[0];
  const publicKey = PublicKey.fromBase58(publicKeyBase58);

  console.log(`Using key:${publicKey.toBase58()}`);
  // setDisplayText(`Using key:${publicKey.toBase58()}`);

  // setDisplayText("Checking if fee payer account exists...");
  console.log("Checking if fee payer account exists...");
  eventListener({
    type: "CREATE_PROOF_EVENT",
    payload: { type: "info", payload: "Checking if fee payer account exist..." },
  });

  const res = await zkappWorkerClient.fetchAccount({
    publicKey: publicKey!,
  });
  console.log("account", res);

  const accountExists = res.error == null;
  await zkappWorkerClient.loadContract();

  console.log("Compiling zkApp...");
  // setDisplayText("Compiling zkApp...");
  await zkappWorkerClient.compileContract();
  console.log("zkApp compiled");
  // setDisplayText("zkApp compiled...");

  const zkappPublicKey = PublicKey.fromBase58(ZKAPP_ADDRESS);
  await zkappWorkerClient.initZkappInstance(zkappPublicKey);

  console.log("Getting zkApp state...", zkappPublicKey);
  // setDisplayText("Getting zkApp state...");
  await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey });

  const currentNum = await zkappWorkerClient.getNum();
  console.log(`Current state in zkApp: ${currentNum.toString()}`);
  eventListener({
    type: "CREATE_PROOF_EVENT",
    payload: {
      type: "info",
      payload: `Current state in zkApp: ${currentNum.toString()}`,
    },
  });

  const prev = performance.now();

  // setState({ ...state, creatingTransaction: true });
  // setDisplayText("Creating a transaction...");
  console.log("Creating a transaction...");

  await zkappWorkerClient.fetchAccount({
    publicKey,
  });

  await zkappWorkerClient.fn6();
  // setDisplayText("Creating proof...");
  console.log("Creating proof...");
  await zkappWorkerClient.proveUpdateTransaction();

  console.log("Requesting send transaction...");
  // setDisplayText("Requesting send transaction...");
  const transactionJSON = await zkappWorkerClient.getTransactionJSON();

  // setDisplayText("Getting transaction JSON...");
  console.log("Getting transaction JSON...");
  const { hash } = await (window as any).mina.sendTransaction({
    transaction: transactionJSON,
    feePayer: {
      fee: transactionFee,
      memo: "",
    },
  });

  const transactionLink = `https://berkeley.minaexplorer.com/transaction/${hash}`;
  console.log(`View transaction at ${transactionLink}`);

  // setTransactionLink(transactionLink);
  // setDisplayText(transactionLink);
  // setState({ ...state, creatingTransaction: false });

  const now = performance.now();

  return {
    duration: now - prev,
    proof: {
      proofBytes: [],
      publicInputSer: "",
      proofPubKey,
    },
  };
}

// export async function verifyMembership(
//   args: VerifyArgs,
//   handlers: PrfsHandlers,
//   circuit: Uint8Array,
// ) {
//   const { proof } = args;
//   const { proofBytes, publicInputSer } = proof;

//   const publicInput = MerkleSigPosRangePublicInput.deserialize(publicInputSer);
//   const isPubInputValid = true;

//   let isProofValid;
//   try {
//     isProofValid = await handlers.verify(
//       circuit,
//       proofBytes,
//       publicInput.circuitPubInput.serialize(),
//     );
//   } catch (err) {
//     throw new Error(`Error calling verify(), err: ${err}`);
//   }

//   return isProofValid && isPubInputValid;
// }
