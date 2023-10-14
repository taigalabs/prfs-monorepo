import { CircuitDriver, LogEventType } from "@taigalabs/prfs-driver-interface";
import {
  CreateProofPayload,
  HashPayload,
  Msg,
  MsgType,
  sendMsgToParent,
} from "@taigalabs/prfs-sdk-web";

import { initDriver, interpolateSystemAssetEndpoint } from "./functions/circuitDriver";
import { createProof } from "./functions/proof";
import { envs } from "./envs";

const ASSET_SERVER_ENDPOINT = envs.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT;

const state: ProofGenModuleState = {
  driver: null,
};

function proofGenEventListener(type: LogEventType, msg: string) {
  sendMsgToParent(new Msg("PROOF_GEN_EVENT", { type, msg }));
}

async function eventListener(ev: MessageEvent) {
  const { driver } = state;

  if (ev.ports.length > 0) {
    const type: MsgType = ev.data.type;
    // console.log("Msg, type: %s", type);

    switch (type) {
      case "CREATE_PROOF": {
        const payload = ev.data.payload as CreateProofPayload;

        console.log("create proof", payload, driver);

        if (!driver) {
          return;
        }

        proofGenEventListener(
          "info",
          `Start proving... hardware concurrency: ${window.navigator.hardwareConcurrency}`
        );

        try {
          const proveReceipt = await createProof(driver, payload, proofGenEventListener);
          ev.ports[0].postMessage(new Msg("CREATE_PROOF_RESPONSE", proveReceipt));
        } catch (err) {
          ev.ports[0].postMessage(new Msg("CREATE_PROOF_RESPONSE", undefined, err));
        }

        break;
      }

      case "LOAD_DRIVER": {
        const { payload } = ev.data;
        const { circuit_driver_id, driver_properties } = payload;

        const driverProperties = interpolateSystemAssetEndpoint(
          driver_properties,
          `${ASSET_SERVER_ENDPOINT}/assets/circuits`
        );

        try {
          const driver = await initDriver(circuit_driver_id, driverProperties);
          state.driver = driver;

          ev.ports[0].postMessage(new Msg("LOAD_DRIVER_RESPONSE", circuit_driver_id));
        } catch (err) {
          console.error(err);
        }

        break;
      }

      case "HASH": {
        const { payload } = ev.data;
        const { msg } = payload as HashPayload;

        if (!driver) {
          return;
        }

        const msgHash = await driver.hash(msg);
        ev.ports[0].postMessage(
          new Msg("HASH_RESPONSE", {
            msgHash,
          })
        );

        // driver.hash();

        break;
      }
    }
  }
}

export async function setupProofGen() {
  window.addEventListener("message", eventListener);
  await sendMsgToParent(new Msg("HANDSHAKE", {}));

  return () => {
    window.removeEventListener("message", eventListener);
  };
}

export interface ProofGenModuleState {
  driver: CircuitDriver | null;
}
