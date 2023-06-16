import { Profiler } from "../helpers/profiler";
import { IProver, MerkleProof, NIZK, ProverConfig } from "../types";
import { loadCircuit, fromSig, snarkJsWitnessGen } from "../helpers/utils";
import {
  PublicInput,
  computeEffEcdsaPubInput,
  CircuitPubInput,
  SECP256K1_N,
  SECP256K1_P,
  computeEffEcdsaPubInput2
} from "../helpers/public_input";
import spartan, { init } from "../prfs_wasm_embedded";
import {
  defaultPubkeyMembershipPConfig,
  defaultAddressMembershipPConfig
} from "../config";

import BN from "bn.js";

/**
 * ECDSA Membership Prover
 */
export class MembershipProver2 extends Profiler implements IProver {
  circuit: string;
  witnessGenWasm: string;

  constructor(options: ProverConfig) {
    super({ enabled: options?.enableProfiler });

    if (
      options.circuit === defaultPubkeyMembershipPConfig.circuit ||
      options.witnessGenWasm ===
      defaultPubkeyMembershipPConfig.witnessGenWasm ||
      options.circuit === defaultAddressMembershipPConfig.circuit ||
      options.witnessGenWasm === defaultAddressMembershipPConfig.witnessGenWasm
    ) {
      console.warn(`
      Spartan-ecdsa default config warning:
      We recommend using defaultPubkeyMembershipPConfig/defaultPubkeyMembershipVConfig only for testing purposes.
      Please host and specify the circuit and witnessGenWasm files on your own server for sovereign control.
      Download files: https://github.com/personaelabs/spartan-ecdsa/blob/main/packages/lib/README.md#circuit-downloads
      `);
    }

    const isNode = typeof window === "undefined";
    if (isNode) {
      if (
        options.circuit.includes("http") ||
        options.witnessGenWasm.includes("http")
      ) {
        throw new Error(
          `An URL was given for circuit/witnessGenWasm in Node.js environment. Please specify a local path.
          `
        );
      }
    }

    this.circuit = options.circuit;
    this.witnessGenWasm = options.witnessGenWasm;
  }

  async init() {
    await init();
  }

  async prove(
    sig: string,
    msgHash: Buffer,
    merkleProof: MerkleProof
  ): Promise<NIZK> {
    console.log("\nMembershipProver2.prove()");

    const { r, s, v } = fromSig(sig);

    console.log("r: %s", r);
    console.log("s: %s", s);
    console.log("v: %s", v);

    // r: 88399259275250167512606436233880855124482651221968106964167275752101991752468n
    // s: 32197108209346059174958080597055114338206976670975960640130758584474334912254n
    // v: 27n

    const effEcdsaPubInput = computeEffEcdsaPubInput2(r, v, msgHash, s);
    console.log("effEcdsaPubInput: {}", effEcdsaPubInput);

    // Tx: 56754023476089034639240321610912533879986019623733800898227959423104157313253n,
    // Ty: 68261210440897581720997727131430574537696012757790129441627398237209171446851n,
    // Ux: 73846475474542607761681470332467667027646668645465076394281972050429435655695n,
    // Uy: 48337513929081960553297892192757607504516173763687917305838720574693931740154n

    const circuitPubInput = new CircuitPubInput(
      merkleProof.root,
      effEcdsaPubInput.Tx,
      effEcdsaPubInput.Ty,
      effEcdsaPubInput.Ux,
      effEcdsaPubInput.Uy
    );

    const publicInput = new PublicInput(r, v, msgHash, circuitPubInput);
    console.log("publicInput: %o", publicInput);

    console.log("secp256k1 p: %s", SECP256K1_P);

    const m = new BN(msgHash).mod(SECP256K1_P);
    // const mInv = m.invm(SECP256K1_P);

    // const y = new BN(2).toString();
    // console.log('y: %s', y);

    // const y2 = new BN(2).invm(SECP256K1_P).toString();
    // console.log('y2: %s', y2);

    // 57896044618658097711785492504343953926418782139537452191302581570759080747169
    // 57896044618658097711785492504343953926634992332820282019728792003954417335832
    // FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F
    // FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
    //
    let sInv = new BN(s as any).invm(SECP256K1_N);
    console.log("sInv: %s", sInv.toString());

    let s_array: bigint[] = bigint_to_array(64, 4, s);
    console.log("s_array: %o", s_array);

    let sInv_array: bigint[] = bigint_to_array(64, 4, BigInt(sInv.toString()));
    console.log("sInv_array: %o", sInv_array);

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
    const witness = await snarkJsWitnessGen(
      witnessGenInput,
      this.witnessGenWasm
    );
    this.timeEnd("Generate witness");

    this.time("Load circuit");
    const circuitBin = await loadCircuit(this.circuit);
    // const circuitBin2 = circuitBytes;

    console.log(11, circuitBin);
    // console.log(22, circuitBin2);

    this.timeEnd("Load circuit");

    // Get the public input in bytes
    const circuitPublicInput: Uint8Array =
      publicInput.circuitPubInput.serialize();

    this.time("Prove");
    let proof = spartan.prove(circuitBin, witness.data, circuitPublicInput);
    this.timeEnd("Prove");

    return {
      proof,
      publicInput
    };
  }
}

// // bigendian
// function bigint_to_Uint8Array(x: bigint) {
//   var ret: Uint8Array = new Uint8Array(32);
//   for (var idx = 31; idx >= 0; idx--) {
//     ret[idx] = Number(x % 256n);
//     x = x / 256n;
//   }
//   return ret;
// }

// // bigendian
// function Uint8Array_to_bigint(x: Uint8Array) {
//   var ret: bigint = 0n;
//   for (var idx = 0; idx < x.length; idx++) {
//     ret = ret * 256n;
//     ret = ret + BigInt(x[idx]);
//   }
//   return ret;
// }

function bigint_to_array(n: number, k: number, x: bigint) {
  let mod: bigint = 1n;
  for (var idx = 0; idx < n; idx++) {
    mod = mod * 2n;
  }
  console.log("mod: %s", mod);

  let ret: bigint[] = [];
  var x_temp: bigint = x;
  for (var idx = 0; idx < k; idx++) {
    ret.push(x_temp % mod);
    x_temp = x_temp / mod;
  }
  return ret;
}
