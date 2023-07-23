import { Profiler } from "../helpers/profiler";
import { MerkleProof, NIZK } from "../types";
import { loadCircuit, fromSig, snarkJsWitnessGen } from "../helpers/utils";
import {
  PublicInput,
  CircuitPubInput,
  SECP256K1_P,
  computeEffEcdsaPubInput2,
  verifyEffEcdsaPubInput,
} from "../helpers/public_input";
import BN from "bn.js";
import { PrfsHandlers } from "../types";

export class MembershipProofGen extends Profiler {
  circuitUrl: string;
  witnessGenWasmUrl: string;
  handlers: PrfsHandlers;

  constructor(
    witnessGenWasmUrl: string,
    circuitUrl: string,
    prfsHandlers: PrfsHandlers,
  ) {
    console.log(
      'Initializing membership prover2, witnesGenWasm: %o, circuitUrl: %o',
      witnessGenWasmUrl,
      circuitUrl,
    );

    super({ enabled: true });
    this.circuitUrl = circuitUrl;
    this.witnessGenWasmUrl = witnessGenWasmUrl;
    this.handlers = prfsHandlers;
  }

  async prove(sig: string, msgHash: Buffer, merkleProof: MerkleProof): Promise<NIZK> {
    console.log("\nMembershipProver2.prove()");

    const { r, s, v } = fromSig(sig);
    console.log("r: %s", r);
    console.log("s: %s", s);
    console.log("v: %s", v);

    const effEcdsaPubInput = computeEffEcdsaPubInput2(r, v, msgHash, s);
    console.log("effEcdsaPubInput: {}", effEcdsaPubInput);

    const circuitPubInput = new CircuitPubInput(
      merkleProof.root,
      effEcdsaPubInput.Tx,
      effEcdsaPubInput.Ty,
      effEcdsaPubInput.Ux,
      effEcdsaPubInput.Uy
    );

    const publicInput = new PublicInput(r, v, msgHash, circuitPubInput);
    console.log("publicInput: %o", publicInput);

    const m = new BN(msgHash).mod(SECP256K1_P);

    let s_array: bigint[] = bigint_to_array(64, 4, s);

    const witnessGenInput = {
      r,
      s,
      s2: s_array,
      m: BigInt(m.toString()),

      ...merkleProof,
      ...effEcdsaPubInput
    };
    console.log("witnessGenInput: %o", witnessGenInput);

    this.time("Generate witness");
    const witness = await snarkJsWitnessGen(witnessGenInput, this.witnessGenWasmUrl);
    this.timeEnd("Generate witness");

    this.time("Load circuit");
    const circuitBin = await loadCircuit(this.circuitUrl);
    this.timeEnd("Load circuit");

    const circuitPublicInput: Uint8Array = publicInput.circuitPubInput.serialize();

    this.time("Prove");
    let proof = await this.handlers.prove(circuitBin, witness.data, circuitPublicInput);
    this.timeEnd("Prove");

    return {
      proof,
      publicInput
    };
  }

  async verify(proof: Uint8Array, publicInputSer: Uint8Array): Promise<boolean> {
    this.time("Load circuit");

    const circuitBin = await loadCircuit(this.circuitUrl);
    this.timeEnd("Load circuit");

    this.time("Verify public input");
    const publicInput = PublicInput.deserialize(publicInputSer);
    const isPubInputValid = verifyEffEcdsaPubInput(publicInput);
    this.timeEnd("Verify public input");

    this.time("Verify proof");
    let isProofValid;
    try {
      isProofValid = await this.handlers.verify(
        circuitBin,
        proof,
        publicInput.circuitPubInput.serialize()
      );
    } catch (_e) {
      isProofValid = false;
    }
    this.timeEnd("Verify proof");

    return isProofValid && isPubInputValid;
  }
}

function bigint_to_array(n: number, k: number, x: bigint) {
  let mod: bigint = 1n;
  for (var idx = 0; idx < n; idx++) {
    mod = mod * 2n;
  }

  let ret: bigint[] = [];
  var x_temp: bigint = x;
  for (var idx = 0; idx < k; idx++) {
    ret.push(x_temp % mod);
    x_temp = x_temp / mod;
  }
  return ret;
}
