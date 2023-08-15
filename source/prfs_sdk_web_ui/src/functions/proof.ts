import { hashPersonalMessage } from "@ethereumjs/util";
import { ethers } from "ethers";
import { makePathIndices, makeSiblingPath } from "@taigalabs/prfs-crypto-js";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";

import { initDriver, interpolateSystemAssetEndpoint } from "./circuitDriver";

export async function createProof(
  proofType: PrfsProofType,
  formValues: Record<string, any>,
  walletAddr: string
) {
  const { driver_id, driver_properties } = proofType;
  const driverProperties = interpolateSystemAssetEndpoint(
    driver_properties,
    process.env.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT
  );

  console.log("driver_id: %s, props: %o", driver_id, driverProperties);

  const driver = await initDriver(driver_id, driverProperties);
  console.log("driver initiated");

  if (!driver) {
    return;
  }

  if (proofType === undefined) {
    return;
  }

  // const addr = await sendMsgToParent(new GetAddressMsg(""));
  // console.log("my address: %s", addr);

  // if (!proofType.circuit_inputs[4].ref) {
  //   throw new Error("set id (ref) is not defined");
  // }

  // const setId = proofType.circuit_inputs[4].ref;

  // let payload;
  // try {
  //   payload = (
  //     await prfsApi.getPrfsTreeLeafNodes({
  //       set_id: setId,
  //       leaf_vals: [addr],
  //     })
  //   ).payload;
  // } catch (err) {
  //   return;
  // }

  // let pos_w = null;
  // for (const node of payload.prfs_tree_nodes) {
  //   if (node.val === addr.toLowerCase()) {
  //     pos_w = node.pos_w;
  //   }
  // }

  // if (pos_w === null) {
  //   throw new Error("Address is not part of a set");
  // }

  // const leafIdx = Number(pos_w);
  // const siblingPath = makeSiblingPath(32, leafIdx);
  // const pathIndices = makePathIndices(32, leafIdx);

  // const siblingPos = siblingPath.map((pos_w, idx) => {
  //   return { pos_h: idx, pos_w };
  // });

  // console.log("leafIdx: %o, siblingPos: %o", leafIdx, siblingPos);

  // try {
  //   payload = (
  //     await prfsApi.getPrfsTreeNodes({
  //       set_id: setId,
  //       pos: siblingPos,
  //     })
  //   ).payload;
  // } catch (err) {
  //   return;
  // }

  // let siblings: BigInt[] = [];
  // for (const node of payload.prfs_tree_nodes) {
  //   siblings[node.pos_h] = BigInt(node.val);
  // }

  // for (let idx = 0; idx < 32; idx += 1) {
  //   if (siblings[idx] === undefined) {
  //     siblings[idx] = BigInt(0);
  //   }
  // }

  // let merkleProof = {
  //   root: BigInt(proofType.circuit_inputs[4].value),
  //   siblings,
  //   pathIndices,
  // };

  // console.log(55, merkleProof);

  // const msgRaw = "harry potter";
  // const msg = Buffer.from(msgRaw);
  // const msgHash = hashPersonalMessage(msg);
  // const sig = await sendMsgToParent(new GetSignatureMsg(msgHash));

  // const sigData = {
  //   msgRaw,
  //   msgHash,
  //   sig,
  // };

  // let recoveredAddr = ethers.utils.verifyMessage(msg, sig);
  // if (walletAddr !== recoveredAddr) {
  //   console.error("Address in the signature is invalid");
  //   return;
  // }

  console.log("Proving...");
  // setIsTimerRunning(true);

  const prevTime = performance.now();
  const { proof, publicInput } = await driver.prove({
    inputs: formValues,
    circuitType: "MEMBERSHIP_PROOF_1",
    eventListener: (msg: string) => {
      console.log("driver event", msg);
    },
  });

  const now = performance.now();
  const diff = now - prevTime;

  console.log("publicInput %o", publicInput);

  // setIsTimerRunning(false);
  console.log("Proof gen complete, duration: %s", diff);
  console.log("Raw proof size (excluding public input)", proof.length, "bytes");

  // await driver.verify();

  // setMsg(`Created a proof in ${diff} ms`);
}
