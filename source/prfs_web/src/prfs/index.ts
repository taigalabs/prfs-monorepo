import {
  Prfs,
  defaultAddressMembershipPConfig,
  defaultPubkeyMembershipPConfig,
  defaultPubkeyMembershipVConfig,
  defaultAddressMembershipVConfig
} from "@taigalabs/prfs-js";
import { initWasm } from '@taigalabs/prfs-js/build/wasm_wrapper/load_es';
import {
  ecsign,
  hashPersonalMessage,
  privateToAddress,
  privateToPublic,
  pubToAddress
} from "@ethereumjs/util";

export async function proveMembership() {
  let prfsHandlers = await initWasm();
  let prfs = new Prfs(prfsHandlers);

  let poseidon = prfs.newPoseidon();
  const privKey = Buffer.from("".padStart(16, "🧙"), "utf16le");
  const msg = Buffer.from("harry potter");
  const msgHash = hashPersonalMessage(msg);
  const { v, r, s } = ecsign(msgHash, privKey);
  const sig = `0x${r.toString("hex")}${s.toString("hex")}${v.toString(16)}`;

  const treeDepth = 32;
  const addressTree = await prfs.newTree(treeDepth, poseidon);

  let proverAddrHex = "0x" + privateToAddress(privKey).toString("hex");
  console.log('proverAddrHex', proverAddrHex);

  const proverAddress = BigInt(proverAddrHex);
  console.log('proverAddress', proverAddress);

  await addressTree.insert(proverAddress);
  // Insert other members into the tree
  for (const member of ["🕵️", "🥷", "👩‍🔬"]) {
    const pubKey = privateToPublic(Buffer.from("".padStart(16, member), "utf16le"));
    const address = BigInt("0x" + pubToAddress(pubKey).toString("hex"));
    console.log('new address', address);

    await addressTree.insert(address);
  }
  const index = addressTree.indexOf(proverAddress);
  const merkleProof = addressTree.createProof(index);

  console.log("merkleProof", merkleProof);

  console.log("Proving...");
  console.time("Full proving time");
  const prover = prfs.newMembershipProver({
    ...defaultAddressMembershipPConfig,
    enableProfiler: true
  });
  const { proof, publicInput } = await prover.prove(sig, msgHash, merkleProof);

  console.log(33, proof, publicInput);
  console.timeEnd("Full proving time");
  console.log("Raw proof size (excluding public input)", proof.length, "bytes");

  console.log("Verifying...");
  const verifier = prfs.newMembershipVerifier({
    ...defaultAddressMembershipVConfig,
    enableProfiler: true
  });

  console.time("Verification time");
  const result = await verifier.verify(proof, publicInput.serialize());
  console.timeEnd("Verification time");
  if (result) {
    console.log("Successfully verified proof!");
  } else {
    console.log("Failed to verify proof :(");
  }

  return proof;
}
