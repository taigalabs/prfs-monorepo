import { CircuitDriver, DriverEvent } from "@taigalabs/prfs-driver-interface";
import {
  CreateProofPayload,
  HashPayload,
  Msg,
  MsgType,
  VerifyProofPayload,
  sendMsgToParent,
} from "@taigalabs/prfs-sdk-web";

import { initDriver, interpolateSystemAssetEndpoint } from "./circuitDriver";
import { createProof, verifyProof } from "./functions/proof";
import { envs } from "./envs";

const ASSET_ACCESS_ENDPOINT = envs.NEXT_PUBLIC_PRFS_ASSET_ACCESS_ENDPOINT;

const state: ProofGenModuleState = {
  driver: null,
};

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

        sendMsgToParent(
          new Msg("CREATE_PROOF_EVENT", {
            type: "info",
            payload: `Start proving... hardware concurrency: ${window.navigator.hardwareConcurrency}`,
          }),
        );

        try {
          const proveReceipt = await createProof(driver, payload, ev => {
            sendMsgToParent(new Msg("CREATE_PROOF_EVENT", ev.payload));
          });
          ev.ports[0].postMessage(new Msg("CREATE_PROOF_RESPONSE", proveReceipt));
        } catch (err) {
          ev.ports[0].postMessage(new Msg("CREATE_PROOF_RESPONSE", undefined, err));
        }

        break;
      }

      case "VERIFY_PROOF": {
        const payload = ev.data.payload as VerifyProofPayload;
        console.log("verify proof", payload, driver);

        if (!driver) {
          return;
        }

        sendMsgToParent(
          new Msg("VERIFY_PROOF_EVENT", {
            type: "info",
            payload: `Start verifying... hardware concurrency: ${window.navigator.hardwareConcurrency}`,
          }),
        );

        try {
          const verifyReceipt = await verifyProof(driver, payload, ev => {
            sendMsgToParent(new Msg("VERIFY_PROOF_EVENT", ev.payload));
          });
          ev.ports[0].postMessage(new Msg("VERIFY_PROOF_RESPONSE", verifyReceipt));
        } catch (err) {
          ev.ports[0].postMessage(new Msg("VERIFY_PROOF_RESPONSE", undefined, err));
        }

        break;
      }

      case "LOAD_DRIVER": {
        const { payload } = ev.data;
        const { circuit_driver_id, driver_properties } = payload;
        // console.log("Loading driver, access_enpdoint: %s", ASSET_ACCESS_ENDPOINT);

        const driverProperties = interpolateSystemAssetEndpoint(
          driver_properties,
          `${ASSET_ACCESS_ENDPOINT}/assets/circuits`,
        );

        try {
          const driver = await initDriver(
            circuit_driver_id,
            driverProperties,
            (ev: DriverEvent) => {
              sendMsgToParent(new Msg("LOAD_DRIVER_EVENT", ev.payload));
            },
          );
          state.driver = driver;

          ev.ports[0].postMessage(
            new Msg("LOAD_DRIVER_RESPONSE", {
              circuitDriverId: circuit_driver_id,
              artifactCount: driver.getArtifactCount(),
            }),
          );
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
          }),
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
