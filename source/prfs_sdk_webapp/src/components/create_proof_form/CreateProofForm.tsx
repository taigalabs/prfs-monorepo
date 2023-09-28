import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { CircuitDriver, LogEventType } from "@taigalabs/prfs-driver-interface";
import { Msg, MsgType, sendMsgToParent } from "@taigalabs/prfs-sdk-web";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";

import styles from "./CreateProofForm.module.scss";
import { initDriver, interpolateSystemAssetEndpoint } from "@/functions/circuitDriver";
import { i18nContext } from "@/contexts/i18n";
import { delay } from "@/functions/interval";
import MerkleProofInput from "@/components/merkle_proof_input/MerkleProofInput";
import SigDataInput from "@/components/sig_data_input/SigDataInput";
import { createProof } from "@/functions/proof";
import CreateProofProgress from "@/components/create_proof_progress/CreateProofProgress";
import { envs } from "@/envs";
import Passcode from "../passcode/Passcode";
import Input from "./Input";
import { validateForm } from "./validateForm";

const ASSET_SERVER_ENDPOINT = envs.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT;

enum CreateProofStatus {
  Loaded,
  InProgress,
}

const CreateProofForm: React.FC<CreateProofFormProps> = ({}) => {
  const i18n = React.useContext(i18nContext);

  console.log(123123);

  const [driver, setDriver] = React.useState<CircuitDriver>();
  const [formValues, setFormValues] = React.useState<Record<string, any>>({});

  React.useEffect(() => {
    console.log("handshake 111");

    async function fn() {
      // window.addEventListener("message", eventListener);
      // await sendMsgToParent(new Msg("HANDSHAKE", {}));
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
            console.log(111, "load driver");
            break;
          }

          // case "GET_FORM_VALUES": {
          //   const newFormValues = await validateForm(
          //     formValues,
          //     proofType.circuit_inputs as CircuitInput[]
          //   );

          //   ev.ports[0].postMessage(new Msg("GET_FORM_VALUES_RESPONSE", newFormValues));
          //   break;
          // }
        }
      }
    }

    fn().then();

    return () => {
      window.removeEventListener("message", eventListener);
    };
  }, []);

  // React.useEffect(() => {
  //   async function fn() {
  //     const { circuit_driver_id, driver_properties } = proofType;
  //     const driverProperties = interpolateSystemAssetEndpoint(
  //       driver_properties,
  //       ASSET_SERVER_ENDPOINT
  //     );

  //     try {
  //       const driver = await initDriver(circuit_driver_id, driverProperties);
  //       setSystemMsg(`${circuit_driver_id}`);
  //       setDriver(driver);
  //     } catch (err) {
  //       setSystemMsg(`Driver init failed, id: ${circuit_driver_id}, err: ${err}`);
  //     }
  //   }

  //   window.setTimeout(() => {
  //     fn().then();
  //   }, 1000);
  // }, [proofType, setSystemMsg, setDriver, setCreateProofStatus]);

  return <div className={styles.wrapper}>5</div>;
};

export default CreateProofForm;

export interface CreateProofFormProps {
  // proofType: PrfsProofType;
  // docHeight: number;
}
