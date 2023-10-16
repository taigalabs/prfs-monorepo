import {
  CircuitDriver,
  LogEventType,
  ProveReceipt,
  ProveResult,
} from "@taigalabs/prfs-driver-interface";
import { CreateProofPayload } from "@taigalabs/prfs-sdk-web";

export async function createProof(
  driver: CircuitDriver,
  payload: CreateProofPayload,
  eventListener: (type: LogEventType, msg: string) => void
): Promise<ProveReceipt> {
  console.log("Proving...");

  const proveReceipt = await driver.prove({
    inputs: payload.inputs,
    circuitTypeId: payload.circuitTypeId,
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
