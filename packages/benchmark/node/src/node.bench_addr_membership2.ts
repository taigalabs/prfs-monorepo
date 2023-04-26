import {
  hashPersonalMessage,
  privateToAddress,
  ecsign
} from "@ethereumjs/util";
import {
  Tree,
  Poseidon,
  MembershipProver,
  MembershipProver2,
  MembershipVerifier
} from "@personaelabs/spartan-ecdsa";
import * as path from "path";

const benchAddrMembership2 = async () => {
  console.log('bench addr membership2');

  const privKey = Buffer.from("".padStart(16, "🧙"), "utf16le");
  const msg = Buffer.from("harry potter");
  const msgHash = hashPersonalMessage(msg);

  console.log('privKey: %s, msgHash: %s', privKey.toString('hex'), msgHash.toString('hex'));

  const { v, r, s } = ecsign(msgHash, privKey);
  const sig = `0x${r.toString("hex")}${s.toString("hex")}${v.toString(16)}`;
  console.log('sig: %s', sig);

  // Init the Poseidon hash
  const poseidon = new Poseidon();
  await poseidon.initWasm();

  const treeDepth = 20;
  const tree = new Tree(treeDepth, poseidon);
  console.log('treeDepth: %s', treeDepth);

  // Get the prover public key hash
  const proverAddress = BigInt(
    "0x" + privateToAddress(privKey).toString("hex")
  );

  console.log('proverAddress: %s', proverAddress);

  // Insert prover public key hash into the tree
  tree.insert(proverAddress);

  // Insert other members into the tree
  for (const member of ["🕵️", "🥷", "👩‍🔬"]) {
    const address = BigInt(
      "0x" +
      privateToAddress(
        Buffer.from("".padStart(16, member), "utf16le")
      ).toString("hex")
    );

    console.log("tree member: %s", address);

    tree.insert(address);
  }

  // Compute the merkle proof
  const index = tree.indexOf(proverAddress);
  console.log('index: %s', index);

  const proverConfig = {
    circuit: path.join(
      __dirname,
      // "../../../circuits/build/addr_membership/addr_membership.circuit"
      "../../../circuits/build/addr_membership2/addr_membership2.circuit",
    ),
    witnessGenWasm: path.join(
      __dirname,
      // "../../../circuits/build/addr_membership/addr_membership_js/addr_membership.wasm"
      "../../../circuits/build/addr_membership2/addr_membership2_js/addr_membership2.wasm"
    ),
    enableProfiler: true
  };

  const merkleProof = tree.createProof(index);
  console.log('merkleProof: %s', merkleProof);


  // Init the prover
  const prover = new MembershipProver2(proverConfig);
  await prover.initWasm();

  // Prove membership
  const { proof, publicInput } = await prover.prove(sig, msgHash, merkleProof);

  const verifierConfig = {
    circuit: proverConfig.circuit,
    enableProfiler: true
  };

  // Init verifier
  const verifier = new MembershipVerifier(verifierConfig);
  await verifier.initWasm();

  // Verify proof
  await verifier.verify(proof, publicInput.serialize());
};

export default benchAddrMembership2;
