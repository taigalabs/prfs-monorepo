import {
  CircuitDriver,
  DriverEvent,
  DriverEventType,
  ProveReceipt,
  VerifyReceipt,
} from "@taigalabs/prfs-driver-interface";
import { CreateProofPayload, VerifyProofPayload } from "@taigalabs/prfs-sdk-web";

export async function createProof(
  driver: CircuitDriver,
  payload: CreateProofPayload,
  eventListener: (ev: DriverEvent) => void,
): Promise<ProveReceipt> {
  try {
    const proveReceipt = await driver.prove({
      inputs: payload.inputs,
      circuitTypeId: payload.circuitTypeId,
      eventListener,
    });
    return proveReceipt;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function verifyProof(
  driver: CircuitDriver,
  payload: VerifyProofPayload,
  eventListener: (ev: DriverEvent) => void,
): Promise<VerifyReceipt> {
  try {
    const verifyResult = await driver.verify({
      proveResult: payload.proveResult,
      circuitTypeId: payload.circuitTypeId,
    });

    return { verifyResult };
  } catch (err: any) {
    console.error(err);
    return { verifyResult: false, error: err };
  }
}
