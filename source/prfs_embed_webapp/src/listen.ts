import {
  CircuitDriver,
  DriverEvent,
  LoadDriverEvent,
  LoadDriverEventPayload,
  LogEventPayload,
} from "@taigalabs/prfs-driver-interface";
import {
  CreateProofPayload,
  HashPayload,
  Msg,
  MsgType,
  VerifyProofPayload,
  sendMsgToParent,
} from "@taigalabs/prfs-sdk-web";

// import { initDriver, interpolateSystemAssetEndpoint } from "./circuitDriver";
// import { createProof, verifyProof } from "./functions/proof";
import { envs } from "./envs";

const ASSET_ACCESS_ENDPOINT = envs.NEXT_PUBLIC_PRFS_ASSET_ACCESS_ENDPOINT;

const state: ProofGenModuleState = {
  driver: null,
};

async function eventListener(ev: MessageEvent) {
  if (ev.ports.length > 0) {
    const type: MsgType = ev.data.type;
    // console.log("Msg, type: %s", type);
  }
}

export async function setupListener() {
  window.addEventListener("message", eventListener);
  console.log("send handshake");
  await sendMsgToParent(new Msg("HANDSHAKE", {}));

  return () => {
    window.removeEventListener("message", eventListener);
  };
}

export interface ProofGenModuleState {
  driver: CircuitDriver | null;
}
