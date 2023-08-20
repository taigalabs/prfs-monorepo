import { ethers } from "ethers";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { CircuitDriver, ProveReceipt, ProveResult } from "@taigalabs/prfs-driver-interface";

// import { initDriver, interpolateSystemAssetEndpoint } from "./circuitDriver";

export async function createProof(
  driver: CircuitDriver,
  formValues: Record<string, any>,
  walletAddr: string,
  eventListener: (type: string, msg: string) => void
): Promise<ProveReceipt> {
  const { sigData } = formValues;
  const { msgRaw, sig } = sigData;
  const msg = Buffer.from(msgRaw);

  let recoveredAddr = ethers.utils.verifyMessage(msg, sig);
  if (walletAddr !== recoveredAddr) {
    // console.error("Address in the signature is invalid");
    throw new Error("Address in the signature is invalid");
  }

  console.log("Proving...");

  const proveReceipt = await driver.prove({
    inputs: formValues,
    circuitType: "MEMBERSHIP_PROOF_1",
    eventListener,
  });

  console.log("proveResult: %o", proveReceipt.proveResult);
  console.log(
    "Raw proof size (excluding public input)",
    proveReceipt.proveResult.proof.length,
    "bytes"
  );

  // const isVerified = await driver.verify({
  //   inputs: proveResult,
  // });

  // console.log("isVerified: %o", isVerified);

  return proveReceipt;
}
