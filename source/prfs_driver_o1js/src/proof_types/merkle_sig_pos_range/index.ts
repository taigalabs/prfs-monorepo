import { ProveArgs, ProveResult, VerifyArgs } from "@taigalabs/prfs-driver-interface";
import { MerkleSigPosRangeV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Inputs";
import {
  JSONbigNative,
  bytesToNumberLE,
  poseidon_2_bigint_le,
  toUtf8Bytes,
} from "@taigalabs/prfs-crypto-js";
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
  Proof,
  ZkappPublicInput,
  Empty,
  MerkleTree,
} from "o1js";
import { BN } from "bn.js";
// import { SECP256K1_P } from "@/math/secp256k1";
//
export const SECP256K1_P = new BN(
  "fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f",
  16,
);

export const SECP256K1_N = new BN(
  "fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
  16,
);

import ZkappWorkerClient from "./zkappWorkerClient";
import { MerkleSigPosRangeV1ContractUpdateArgs } from "@taigalabs/prfs-circuits-o1js/src/merkle_sig_pos_range_v1";

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

  // const proofPubKeyBytes = toUtf8Bytes(proofPubKey);
  // const proofPubKeyInt = BigInt(new BN(proofPubKeyBytes).mod(SECP256K1_P).toString());

  // const nonceRawBytes = toUtf8Bytes(nonceRaw);
  // const nonceInt = BigInt(new BN(nonceRawBytes).mod(SECP256K1_P).toString());

  const idx0 = 0n;
  const tree_ = new MerkleTree(32);
  const sigpos_ = Field(sigpos);
  const assetSize_ = Field(assetSize);
  const assetSizeGreaterEqThan_ = Field(assetSizeGreaterEqThan);
  const assetSizeLessThan_ = Field(assetSizeLessThan);
  // const nonceRaw_ = "nonce";
  const nonceInt_ = Poseidon.hash(CircuitString.fromString(nonceRaw).toFields());
  // const proofPubKey_ = "0x0";
  const proofPubKeyInt_ = Poseidon.hash(CircuitString.fromString(proofPubKey).toFields());

  const leaf_ = Poseidon.hash([sigpos_, assetSize_]);
  tree_.setLeaf(idx0, leaf_);
  tree_.setLeaf(1n, Field(1));
  tree_.setLeaf(2n, Field(2));
  tree_.setLeaf(3n, Field(3));

  const sigposAndNonce = Poseidon.hash([sigpos_, nonceInt_]);
  const serialNo = Poseidon.hash([sigposAndNonce, proofPubKeyInt_]);
  const root_ = tree_.getRoot();
  const witness_ = tree_.getWitness(idx0);
  const merklePath_ = witness_.map(w => {
    const obj = {
      isLeft: w.isLeft,
      sibling: w.sibling.toJSON(),
    };
    return obj;
  });

  const contractArgs: MerkleSigPosRangeV1ContractUpdateArgs = {
    root: root_.toJSON(),
    sigpos: sigpos_.toJSON(),
    merklePath: merklePath_,
    leaf: leaf_.toJSON(),
    assetSize: assetSize_.toJSON(),
    assetSizeGreaterEqThan: assetSizeGreaterEqThan_.toJSON(),
    assetSizeLessThan: assetSizeLessThan_.toJSON(),
    nonce: nonceInt_.toJSON(),
    proofPubKey: proofPubKeyInt_.toJSON(),
    serialNo: serialNo.toJSON(),
  };

  console.log("Loading web worker...");
  eventListener({
    type: "CREATE_PROOF_EVENT",
    payload: { type: "info", payload: "Loading web worker" },
  });
  const zkappWorkerClient = new ZkappWorkerClient();
  await timeout(3);

  console.log("Done loading web worker");

  await zkappWorkerClient.setActiveInstanceToBerkeley();

  const mina = (window as any).mina;
  if (mina == null) {
    throw new Error("Mina does not exist");
  }

  const publicKeyBase58: string = (await mina.requestAccounts())[0];
  const publicKey = PublicKey.fromBase58(publicKeyBase58);

  console.log(`Using key:${publicKey.toBase58()}`);
  console.log("Checking if fee payer account exists...");
  eventListener({
    type: "CREATE_PROOF_EVENT",
    payload: { type: "info", payload: "Checking if fee payer account exist..." },
  });

  const res = await zkappWorkerClient.fetchAccount({
    publicKey: publicKey!,
  });
  console.log("Account", res);

  await zkappWorkerClient.loadContract();

  console.log("Compiling zkApp...");
  eventListener({
    type: "CREATE_PROOF_EVENT",
    payload: {
      type: "info",
      payload: "Compiling zkApp...",
    },
  });
  await zkappWorkerClient.compileContract();
  console.log("zkApp compiled");
  eventListener({
    type: "CREATE_PROOF_EVENT",
    payload: {
      type: "info",
      payload: "zkApp compiled",
    },
  });

  const zkappPublicKey = PublicKey.fromBase58(ZKAPP_ADDRESS);
  await zkappWorkerClient.initZkappInstance(zkappPublicKey);

  // console.log("Getting zkApp state...", zkappPublicKey);
  // // setDisplayText("Getting zkApp state...");
  // await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey });
  // console.log(`Fetched account, publicKey ${zkappPublicKey}`);

  // const currentNum = await zkappWorkerClient.getNum();
  // console.log(`Current state in zkApp: ${currentNum.toString()}`);
  // eventListener({
  //   type: "CREATE_PROOF_EVENT",
  //   payload: {
  //     type: "info",
  //     payload: `Current state in zkApp: ${currentNum.toString()}`,
  //   },
  // });

  const prev = performance.now();

  console.log("Creating a transaction...");
  eventListener({
    type: "CREATE_PROOF_EVENT",
    payload: {
      type: "info",
      payload: `Creating a transaction...`,
    },
  });

  await zkappWorkerClient.fetchAccount({
    publicKey,
  });

  await zkappWorkerClient.fn6(contractArgs);
  console.log("Creating proof...");
  eventListener({
    type: "CREATE_PROOF_EVENT",
    payload: {
      type: "info",
      payload: `Creating proof...`,
    },
  });

  const proofStr = (await zkappWorkerClient.proveUpdateTransaction()) as string;
  const proof = JSON.parse(proofStr) as (Proof<ZkappPublicInput, Empty> | undefined)[];
  console.log("proof", proof);

  let publicInput;
  let proofBytes;
  if (proof && proof.length > 0) {
    console.log(33, proof[0]!.publicInput, proof[0]!.proof);
    publicInput = JSONbigNative.stringify(proof[0]!.publicInput);
    proofBytes = toUtf8Bytes(proof[0]!.proof as any);
  } else {
    publicInput = JSONbigNative.stringify([0, 0]);
    proofBytes = [];
  }

  console.log("Requesting send transaction...");
  eventListener({
    type: "CREATE_PROOF_EVENT",
    payload: {
      type: "info",
      payload: `Send transaction...`,
    },
  });
  const transactionJSON = await zkappWorkerClient.getTransactionJSON();

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
  eventListener({
    type: "CREATE_PROOF_EVENT",
    payload: {
      type: "info",
      payload: `View transaction at ${transactionLink}`,
    },
  });

  const now = performance.now();

  return {
    duration: now - prev,
    proof: {
      proofBytes: proofBytes,
      publicInputSer: publicInput,
      proofPubKey,
      ledger: transactionLink,
      txHash: hash,
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
