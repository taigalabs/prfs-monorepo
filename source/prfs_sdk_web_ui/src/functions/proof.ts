import { CircuitDriver, ProveReceipt, ProveResult } from "@taigalabs/prfs-driver-interface";

export async function createProof(
  driver: CircuitDriver,
  formValues: Record<string, any>,
  eventListener: (type: string, msg: string) => void
): Promise<ProveReceipt> {
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
