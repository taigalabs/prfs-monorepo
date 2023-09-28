import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { CircuitDriver, LogEventType } from "@taigalabs/prfs-driver-interface";
import { Msg, MsgType, sendMsgToParent } from "@taigalabs/prfs-sdk-web";

import { initDriver, interpolateSystemAssetEndpoint } from "@/functions/circuitDriver";
import { i18nContext } from "@/contexts/i18n";
import { delay } from "@/functions/interval";
import { createProof } from "@/functions/proof";
import { envs } from "@/envs";

const ASSET_SERVER_ENDPOINT = envs.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT;

export function useProofGen() {
  const [driver, setDriver] = React.useState<CircuitDriver>();

  React.useEffect(() => {
    console.log("handshake 111");

    async function fn() {
      window.addEventListener("message", eventListener);

      await sendMsgToParent(new Msg("HANDSHAKE", {}));
    }

    // proofGenEventListener(
    //   "info",
    //   `Start proving... hardware concurrency: ${window.navigator.hardwareConcurrency}`
    // );

    async function eventListener(ev: MessageEvent) {
      if (ev.ports.length > 0) {
        const type: MsgType = ev.data.type;

        switch (type) {
          case "CREATE_PROOF": {
            if (!driver) {
              return;
            }

            // try {
            //   const newFormValues = await validateForm(
            //     formValues,
            //     proofType.circuit_inputs as CircuitInput[]
            //   );

            //   setCreateProofStatus(CreateProofStatus.InProgress);
            //   proofGenEventListener("debug", `Process starts in 3 seconds`);

            //   await delay(3000);

            //   proofGenEventListener(
            //     "info",
            //     `Start proving... hardware concurrency: ${window.navigator.hardwareConcurrency}`
            //   );

            //   const proveReceipt = await createProof(driver, formValues, proofGenEventListener);

            //   proofGenEventListener("info", `Proof created in ${proveReceipt.duration}ms`);

            //   ev.ports[0].postMessage(new Msg("CREATE_PROOF_RESPONSE", proveReceipt));
            // } catch (err) {
            //   console.error(err);
            // }

            break;
          }

          case "LOAD_DRIVER": {
            console.log(111, "load driver", ev.data);

            const { payload } = ev.data;
            const { circuit_driver_id, driver_properties } = payload;

            const driverProperties = interpolateSystemAssetEndpoint(
              driver_properties,
              `${ASSET_SERVER_ENDPOINT}/assets/circuits`
            );

            try {
              const driver = await initDriver(circuit_driver_id, driverProperties);
              setDriver(driver);
              ev.ports[0].postMessage(new Msg("LOAD_DRIVER_RESPONSE", circuit_driver_id));
            } catch (err) {
              console.error(err);
            }

            break;
          }
        }
      }
    }

    fn().then();

    return () => {
      window.removeEventListener("message", eventListener);
    };
  }, []);
}
