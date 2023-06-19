import {
  ecrecover,
  hashPersonalMessage,
  privateToAddress,
  privateToPublic,
  ecsign
} from "@ethereumjs/util";
import {
  Tree,
  Poseidon,
  // MembershipProver,
  MembershipProver2,
  MembershipVerifier
} from "@taigalabs/prfs-js";
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

  const recoveredPubkey = ecrecover(msgHash, v, r, s);
  console.log('recoveredPubKey: %s', recoveredPubkey.toString("hex"));

  // Init the Poseidon hash
  const poseidon = new Poseidon();
  await poseidon.initWasm();

  const treeDepth = 20;
  const tree = new Tree(treeDepth, poseidon);
  console.log('treeDepth: %s', treeDepth);

  let pubKey = privateToPublic(privKey).toString("hex");
  console.log('pubKey: %s', pubKey);

  // Get the prover public key hash
  const proverAddress = BigInt(
    "0x" + privateToAddress(privKey).toString("hex")
  );

  console.log('proverAddress: %s', proverAddress);

  // privkey: 3ed8d9dd3ed8d9dd3ed8d9dd3ed8d9dd3ed8d9dd3ed8d9dd3ed8d9dd3ed8d9dd
  // addr: 498879796456181921449738817404732008511032487588
  // msgHash: 8e05c70f46dbc3dda34547fc23ac835d728001bac55db9bd122d77d10d294431
  //
  //
  // pubKey: 73703d822b3a4bf694d7c29e9200e6e20ba00068a33886cb393a7a908012e1b3fd9467081aa964663cb75e399fa545ba1932dbebae97da9fdd841994df77e69c
  // ecdsa pubKeyX 52214288974203445087818892579159062048801683954983338503936671052416851042739 
  // ecdsa pubKeyY 114697355155514693390991434304085458074577096167918068468089360774221643900572

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

  const addrMembershipCircuitPath = path.resolve('../../prfs_circuits/build/addr_membership2/addr_membership2.circuit');
  const witnessGenWasmPath = path.resolve('../../prfs_circuits/build/addr_membership2/addr_membership2_js/addr_membership2.wasm');

  console.log('addrMembershipCircuitPath: %s', addrMembershipCircuitPath);
  console.log('witnessGenWasmPath: %s', witnessGenWasmPath);

  const proverConfig = {
    circuit: addrMembershipCircuitPath,
    witnessGenWasm: witnessGenWasmPath,
    enableProfiler: true
  };

  const merkleProof = tree.createProof(index);
  console.log('merkleProof: %s', merkleProof);

  // Init the prover
  const prover = new MembershipProver2(proverConfig);
  await prover.init();

  // Prove membership
  const { proof, publicInput } = await prover.prove(sig, msgHash, merkleProof);

  const verifierConfig = {
    circuit: proverConfig.circuit,
    enableProfiler: true
  };

  // Init verifier
  const verifier = new MembershipVerifier(verifierConfig);
  await verifier.init();

  // Verify proof
  await verifier.verify(proof, publicInput.serialize());
};

export default benchAddrMembership2;
