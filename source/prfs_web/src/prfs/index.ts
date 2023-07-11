import {
  Prfs,
} from "@taigalabs/prfs-js";
import { initWasm } from "@taigalabs/prfs-js/build/wasm_wrapper/load_es";
import {
  ecsign,
  hashPersonalMessage,
  privateToAddress,
  privateToPublic,
  pubToAddress
} from "@ethereumjs/util";
import { ethers, verifyMessage } from "ethers";
import { MerkleProof } from "@personaelabs/spartan-ecdsa";
import { getAddrMembership2CircuitUrl, getAddrMembership2WtnsGenUrl } from "./env";

let addrs = [
  "0x33d10ab178924ecb7ad52f4c0c8062c3066607ec",
  "0x4f6fcaae3fc4124acaccc780c6cb0dd69ddbeff8",
  "0x50d34ee0ac40da7779c42d3d94c2072e5625395f",
  "0x51c0e162bd86b63933262d558a8953def4e30c85"
  // "0x5247cdfffeeff5fac15e214c6bfcca5e45a135c0",
  // "0x53c8f1af4885182eae85779833548c8f5bc5d91a",
  //
  // "0x5683e37f839bf91cccfb1c8a677c770af5d2f690",
  // "0x5aee774c6e2533288b0a5547dc4f6be8d85907ab",
  // "0x5b140f8f4000fce4ac0baf88cb39dfdcf9c48cae",
  // "0x5d1762d202afbb376c2ffb99fba0bab6b08cdea6",
  // "0x604c8ff002b78cac70aff07adb7338e541d3a348",
  //
  // "0x62195385a55b3f2f77f13e355af8f5a2caf6ac78",
  // "0x6383e90818f26c4a01df881bd6ad6af416d50076",
  // "0x6420d34e50fa91e21f6864828709c392473f220a",
  // "0x6438ed942eea0f102950d06c74e73cf677f4655f",
  // "0x67284e6473dd2afca0782e24dae6d79f712c270f",
];

export async function proveMembership(signer: ethers.JsonRpcSigner) {
  // await f1(signer);
  await f2(signer);
}

async function f1(signer: ethers.JsonRpcSigner) {
  let addrMembership2WtnsGenUrl = getAddrMembership2WtnsGenUrl();
  let addrMembership2CircuitUrl = getAddrMembership2CircuitUrl();

  let prfsHandlers = await initWasm();
  let prfs = new Prfs(prfsHandlers);

  let buildStatus = await prfs.getBuildStatus();
  console.log("buildStatus: %o", buildStatus);

  let poseidon = prfs.newPoseidon();
  // const privKey = Buffer.from("".padStart(16, "🧙"), "utf16le");
  const msg = Buffer.from("harry potter");
  const msgHash = hashPersonalMessage(msg);

  // const { v, r, s } = ecsign(msgHash, privKey);
  // const sig = `0x${r.toString("hex")}${s.toString("hex")}${v.toString(16)}`;

  // let provider = new ethers.BrowserProvider(window.ethereum);
  let proverAddrHex = signer.address;
  // let sig = await provider.send('personal_sign', [ethers.hexlify(msg), proverAddrHex.toLowerCase()]);
  let sig = await signer.signMessage(msg);
  // proverAddrHex = proverAddrHex.toLowerCase();

  let verifyMsg = verifyMessage(msg, sig);
  console.log("verified addr", verifyMsg);

  console.log("sig", sig);

  const treeDepth = 32;
  const addressTree = await prfs.newTree(treeDepth, poseidon);

  // let proverAddrHex = "0x" + privateToAddress(privKey).toString("hex");
  const proverAddress = BigInt(proverAddrHex);

  console.log("proverAddrHex", proverAddrHex);
  console.log("proverAddress", proverAddress);
  // await addressTree.insert(proverAddress);

  let addrs2 = [];
  for (const addr of addrs) {
    let a = BigInt(addr);
    console.log("new address", a);
    addrs2.push(a);
    await addressTree.insert(a);
  }

  let q = await poseidon([proverAddress, addrs2[0]]);
  console.log("poseidon", q);

  const index = addressTree.indexOf(proverAddress);
  const merkleProof = addressTree.createProof(index);

  console.log("merkleProof", merkleProof);

  console.log("Proving...");
  console.time("Full proving time");
  const proofGen = prfs.newMembershipProofGen(
    addrMembership2WtnsGenUrl,
    addrMembership2CircuitUrl,
  );

  const { proof, publicInput } = await proofGen.prove(sig, msgHash, merkleProof);

  console.timeEnd("Full proving time");
  console.log("Raw proof size (excluding public input)", proof.length, "bytes");

  console.log("Verifying...");
  console.time("Verification time");
  const result = await proofGen.verify(proof, publicInput.serialize());
  console.timeEnd("Verification time");

  if (result) {
    console.log("Successfully verified proof!");
  } else {
    console.log("Failed to verify proof :(");
  }

  return proof;
}

async function f2(signer: ethers.JsonRpcSigner) {
  let addrMembership2CircuitUrl = getAddrMembership2CircuitUrl();
  let addrMembership2WtnsGenUrl = getAddrMembership2WtnsGenUrl();

  let prfsHandlers = await initWasm();
  let prfs = new Prfs(prfsHandlers);

  let buildStatus = await prfs.getBuildStatus();
  console.log("buildStatus: %o", buildStatus);

  let merkleProof: MerkleProof = await prfs.makeMerkleProof(addrs, BigInt(0), 32);
  console.log("merkle proof", merkleProof);

  // let poseidon = prfs.newPoseidon();
  const msg = Buffer.from("harry potter");
  const msgHash = hashPersonalMessage(msg);

  let sig = await signer.signMessage(msg);
  console.log("sig", sig);

  let verifyMsg = verifyMessage(msg, sig);
  console.log("verified addr", verifyMsg);

  let proverAddress = signer.address;
  console.log("proverAddr", proverAddress);

  const proverAddr = BigInt(proverAddress);
  console.log("proverAddr", proverAddr);

  const addr1 = BigInt(addrs[1]);
  console.log("Addr1", addr1);

  console.log("Proving...");
  console.time("Full proving time");
  const proofGen = prfs.newMembershipProofGen(
    addrMembership2WtnsGenUrl,
    addrMembership2CircuitUrl,
  );
  const { proof, publicInput } = await proofGen.prove(sig, msgHash, merkleProof);

  console.timeEnd("Full proving time");
  console.log("Raw proof size (excluding public input)", proof.length, "bytes");

  console.log("Verifying...");

  console.time("Verification time");
  const result = await proofGen.verify(proof, publicInput.serialize());
  console.timeEnd("Verification time");

  if (result) {
    console.log("Successfully verified proof!");
  } else {
    console.log("Failed to verify proof :(");
  }
}
