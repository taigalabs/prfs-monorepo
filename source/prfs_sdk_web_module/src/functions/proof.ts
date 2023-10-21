import {
  CircuitDriver,
  LogEventType,
  ProveReceipt,
  ProveResult,
  VerifyReceipt,
} from "@taigalabs/prfs-driver-interface";
import { CreateProofPayload, VerifyProofPayload } from "@taigalabs/prfs-sdk-web";

export async function createProof(
  driver: CircuitDriver,
  payload: CreateProofPayload,
  eventListener: (type: LogEventType, msg: string) => void
): Promise<ProveReceipt> {
  const proveReceipt = await driver.prove({
    inputs: payload.inputs,
    circuitTypeId: payload.circuitTypeId,
    eventListener,
  });

  console.log("proveResult: %o", proveReceipt.proveResult);

  return proveReceipt;
}

export async function verifyProof(
  driver: CircuitDriver,
  payload: VerifyProofPayload,
  _eventListener: (type: LogEventType, msg: string) => void
): Promise<VerifyReceipt> {
  try {
    const verifyResult = await driver.verify({
      proveResult: payload.proveResult,
      circuitTypeId: payload.circuitTypeId,
    });

    console.log("verifyResult: %o", verifyResult);

    return { verifyResult };
  } catch (err: any) {
    return { verifyResult: false, error: err };
  }
}
