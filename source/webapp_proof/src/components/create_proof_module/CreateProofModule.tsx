import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { CircuitDriver, LogEventType } from "@taigalabs/prfs-driver-interface";
import { Msg, MsgType, sendMsgToParent } from "@taigalabs/prfs-sdk-web";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";

import styles from "./CreateProofModule.module.scss";
import { initDriver, interpolateSystemAssetEndpoint } from "@/functions/circuitDriver";
import { i18nContext } from "@/contexts/i18n";
import { delay } from "@/functions/interval";
import MerkleProofInput from "@/components/merkle_proof_input/MerkleProofInput";
import SigDataInput from "@/components/sig_data_input/SigDataInput";
import { createProof } from "@/functions/proof";
import CreateProofProgress from "../create_proof_progress/CreateProofProgress";
import { envs } from "@/envs";
import Passcode from "../passcode/Passcode";
import { FormInput, FormInputTitleRow } from "@/components/form_input/FormInput";
import { validateInputs } from "@/validate";

const ASSET_SERVER_ENDPOINT = envs.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT;

enum CreateProofStatus {
  Loaded,
  InProgress,
}

const CreateProofModule: React.FC<CreateProofModuleProps> = ({ proofType }) => {
  const i18n = React.useContext(i18nContext);

  const [systemMsg, setSystemMsg] = React.useState("Loading driver...");
  const [createProofStatus, setCreateProofStatus] = React.useState(CreateProofStatus.Loaded);
  const [terminalLog, setTerminalLog] = React.useState<string>("");
  const [driver, setDriver] = React.useState<CircuitDriver>();
  const [formValues, setFormValues] = React.useState<Record<string, any>>({});

  const proofGenEventListener = React.useCallback(
    (type: LogEventType, msg: string) => {
      setTerminalLog(msg);
    },
    [setTerminalLog]
  );

  const handleChangeValue = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const { name } = ev.target;
      setFormValues(oldVals => {
        return {
          ...oldVals,
          [name]: ev.target.value,
        };
      });
    },
    [setFormValues]
  );

  React.useEffect(() => {
    async function eventListener(ev: MessageEvent) {
      if (ev.ports.length > 0) {
        const type: MsgType = ev.data.type;

        switch (type) {
          case "CREATE_PROOF": {
            if (!driver) {
              return;
            }

            try {
              const newFormValues = await validateInputs(formValues, proofType);

              setCreateProofStatus(CreateProofStatus.InProgress);
              proofGenEventListener("debug", `Process starts in 3 seconds`);

              await delay(3000);

              proofGenEventListener(
                "info",
                `Start proving... hardware concurrency: ${window.navigator.hardwareConcurrency}`
              );

              const proveReceipt = await createProof(driver, newFormValues, proofGenEventListener);

              proofGenEventListener("info", `Proof created in ${proveReceipt.duration}ms`);

              ev.ports[0].postMessage(new Msg("CREATE_PROOF_RESPONSE", proveReceipt));
            } catch (err) {
              console.error(err);
            }

            break;
          }

          case "GET_FORM_VALUES": {
            const newFormValues = await validateInputs(formValues, proofType);

            ev.ports[0].postMessage(new Msg("GET_FORM_VALUES_RESPONSE", newFormValues));
            break;
          }
        }
      }
    }

    window.addEventListener("message", eventListener);

    return () => {
      window.removeEventListener("message", eventListener);
    };
  }, [proofType, formValues, driver]);

  React.useEffect(() => {
    async function fn() {
      const { circuit_driver_id, driver_properties } = proofType;
      const driverProperties = interpolateSystemAssetEndpoint(
        driver_properties,
        ASSET_SERVER_ENDPOINT
      );

      try {
        const driver = await initDriver(circuit_driver_id, driverProperties);
        setSystemMsg(`${circuit_driver_id}`);
        setDriver(driver);
      } catch (err) {
        setSystemMsg(`Driver init failed, id: ${circuit_driver_id}, err: ${err}`);
      }
    }

    window.setTimeout(() => {
      fn().then();
    }, 1000);
  }, [proofType, setSystemMsg, setDriver, setCreateProofStatus]);

  const circuitInputsElem = React.useMemo(() => {
    const circuit_inputs = proofType.circuit_inputs as CircuitInput[];

    const entriesElem = [];
    for (const [idx, input] of circuit_inputs.entries()) {
      switch (input.type) {
        case "MERKLE_PROOF_1": {
          entriesElem.push(
            <MerkleProofInput
              key={idx}
              circuitInput={input}
              value={formValues[input.name] as any}
              setFormValues={setFormValues}
            />
          );
          break;
        }
        case "SIG_DATA_1": {
          entriesElem.push(
            <SigDataInput
              key={idx}
              circuitInput={input}
              value={formValues[input.name] as any}
              setFormValues={setFormValues}
            />
          );
          break;
        }
        case "PASSCODE": {
          entriesElem.push(
            <Passcode
              key={idx}
              circuitInput={input}
              value={formValues[input.name]}
              handleChangeValue={handleChangeValue}
            />
          );
          break;
        }
        case "PASSCODE_CONFIRM": {
          entriesElem.push(
            <Passcode
              key={idx}
              circuitInput={input}
              value={formValues[input.name]}
              handleChangeValue={handleChangeValue}
            />
          );

          entriesElem.push(
            <Passcode
              key={`${idx}-confirm`}
              confirm
              circuitInput={input}
              value={formValues[input.name]}
              handleChangeValue={handleChangeValue}
            />
          );
          break;
        }
        default: {
          console.error(`Cannot handle circuit input of this type`);

          entriesElem.push(
            <FormInput key={idx}>
              <FormInputTitleRow>
                <p>{input.label}</p>
              </FormInputTitleRow>
              <input placeholder="Cannot handle circuit input of this type" />
            </FormInput>
          );
        }
      }
    }

    return entriesElem;
  }, [proofType, formValues, setFormValues]);

  if (!proofType) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.form}>{circuitInputsElem}</div>

      <div className={styles.terminalLogContainer}>{terminalLog}</div>

      <div className={styles.footer}>
        <div>
          <div className={styles.systemMsg}>
            <span>
              {systemMsg} ({i18n.prfs} {envs.NEXT_PUBLIC_ZAUTH_VERSION})
            </span>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default CreateProofModule;

export interface CreateProofModuleProps {
  proofType: PrfsProofType;
  // docHeight: number;
}
