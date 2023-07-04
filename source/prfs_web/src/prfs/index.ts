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
import { ethers } from "ethers";

let addrs = [
  "0x4f6fcaae3fc4124acaccc780c6cb0dd69ddbeff8",
  "0x50d34ee0ac40da7779c42d3d94c2072e5625395f",
  "0x51c0e162bd86b63933262d558a8953def4e30c85",
  "0x5247cdfffeeff5fac15e214c6bfcca5e45a135c0",
  "0x53c8f1af4885182eae85779833548c8f5bc5d91a",
  //
  "0x5683e37f839bf91cccfb1c8a677c770af5d2f690",
  "0x5aee774c6e2533288b0a5547dc4f6be8d85907ab",
  "0x5b140f8f4000fce4ac0baf88cb39dfdcf9c48cae",
  "0x5d1762d202afbb376c2ffb99fba0bab6b08cdea6",
  "0x604c8ff002b78cac70aff07adb7338e541d3a348",
  //
  "0x62195385a55b3f2f77f13e355af8f5a2caf6ac78",
  "0x6383e90818f26c4a01df881bd6ad6af416d50076",
  "0x6420d34e50fa91e21f6864828709c392473f220a",
  "0x6438ed942eea0f102950d06c74e73cf677f4655f",
  "0x67284e6473dd2afca0782e24dae6d79f712c270f",
];

export async function proveMembership(signer: ethers.JsonRpcSigner) {
  let prfsHandlers = await initWasm();
  let prfs = new Prfs(prfsHandlers);

  let poseidon = prfs.newPoseidon();
  // const privKey = Buffer.from("".padStart(16, "🧙"), "utf16le");
  const msg = Buffer.from("harry potter");
  const msgHash = hashPersonalMessage(msg);
  let sig = await signer.signMessage(msgHash);
  console.log(22, sig);

  // const { v, r, s } = ecsign(msgHash, privKey);
  // const sig = `0x${r.toString("hex")}${s.toString("hex")}${v.toString(16)}`;

  // 0xbcc80e72f6628821422f5f21ba2a92557eeaf412ebfa18d923edaec643e1a1ff157724f285bbccc95c5d077e83c4ac2282b6374c4a3eeac28eac05f1555114361b

  const treeDepth = 32;
  const addressTree = await prfs.newTree(treeDepth, poseidon);

  // let proverAddrHex = "0x" + privateToAddress(privKey).toString("hex");
  let proverAddress = signer.address;
  console.log('proverAddr', proverAddress);

  const proverAddr = BigInt(proverAddress);
  console.log('proverAddr', proverAddr);

  await addressTree.insert(proverAddr);
  for (const addr of addrs) {
    const address = BigInt(addr);
    console.log('addr: %s, address: %s', addr, address);
    await addressTree.insert(address);
  }
  // for (const member of ["🕵️", "🥷", "👩‍🔬"]) {
  //   const pubKey = privateToPublic(Buffer.from("".padStart(16, member), "utf16le"));
  //   const address = BigInt("0x" + pubToAddress(pubKey).toString("hex"));
  //   console.log('new address', address);

  //   await addressTree.insert(address);
  // }
  const index = addressTree.indexOf(proverAddr);
  const merkleProof = addressTree.createProof(index);

  console.log("merkleProof", merkleProof);

  // console.log("Proving...");
  // console.time("Full proving time");
  // const prover = prfs.newMembershipProver({
  //   ...defaultAddressMembershipPConfig,
  //   enableProfiler: true
  // });
  // const { proof, publicInput } = await prover.prove(sig, msgHash, merkleProof);

  // console.log(33, proof, publicInput);
  // console.timeEnd("Full proving time");
  // console.log("Raw proof size (excluding public input)", proof.length, "bytes");

  // console.log("Verifying...");
  // const verifier = prfs.newMembershipVerifier({
  //   ...defaultAddressMembershipVConfig,
  //   enableProfiler: true
  // });

  // console.time("Verification time");
  // const result = await verifier.verify(proof, publicInput.serialize());
  // console.timeEnd("Verification time");
  // if (result) {
  //   console.log("Successfully verified proof!");
  // } else {
  //   console.log("Failed to verify proof :(");
  // }

  // return proof;
}

function decomposeSig(buf: string, chainId?: string) {
  const r = Buffer.from(buf.slice(0, 32))
  const s = Buffer.from(buf.slice(32, 64))

  const v =
    chainId === undefined
      ? BigInt(sig.recovery! + 27)
      : BigInt(sig.recovery! + 35) + BigInt(chainId) * BigInt(2)

  return { r, s, v }
}
