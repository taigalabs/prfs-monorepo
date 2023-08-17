import { ethers } from "ethers";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";

import { initDriver, interpolateSystemAssetEndpoint } from "./circuitDriver";

export async function createProof(
  proofType: PrfsProofType,
  formValues: Record<string, any>,
  walletAddr: string,
  eventListener: (type: string, msg: string) => void
) {
  const { driver_id, driver_properties } = proofType;
  const driverProperties = interpolateSystemAssetEndpoint(
    driver_properties,
    process.env.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT
  );

  console.log("driver_id: %s, props: %o", driver_id, driverProperties);

  const driver = await initDriver(driver_id, driverProperties);

  if (!driver) {
    return;
  }

  if (proofType === undefined) {
    return;
  }

  const { sigData } = formValues;
  const { msgRaw, sig } = sigData;
  const msg = Buffer.from(msgRaw);

  let recoveredAddr = ethers.utils.verifyMessage(msg, sig);
  if (walletAddr !== recoveredAddr) {
    console.error("Address in the signature is invalid");
    return;
  }

  console.log("Proving...");
  const prevTime = performance.now();

  const proveResult = await driver.prove({
    inputs: formValues,
    circuitType: "MEMBERSHIP_PROOF_1",
    eventListener,
  });

  const now = performance.now();
  const diff = now - prevTime;

  console.log("proveResult: %o", proveResult);

  console.log("Proof gen complete, duration: %s", diff);
  console.log("Raw proof size (excluding public input)", proveResult.proof.length, "bytes");

  const isVerified = await driver.verify({
    inputs: proveResult,
  });

  console.log("isVerified: %o", isVerified);

  return proveResult;
}
