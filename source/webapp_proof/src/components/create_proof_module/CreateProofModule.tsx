import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { GetPrfsAssetMetaRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsAssetMetaRequest";
import { LogEventType, ProveReceipt } from "@taigalabs/prfs-driver-interface";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { useMutation } from "wagmi";
import { prfsAssetApi } from "@taigalabs/prfs-api-js";
import { PrfsSDK } from "@taigalabs/prfs-sdk-web";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";

import styles from "./CreateProofModule.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { delay } from "@/functions/interval";
import MerkleProofInput from "@/components/merkle_proof_input/MerkleProofInput";
import SigDataInput from "@/components/sig_data_input/SigDataInput";
import { envs } from "@/envs";
import Passcode from "@/components/passcode/Passcode";
import { FormInput, FormInputTitleRow } from "@/components/form_input/FormInput";
import { validateInputs } from "@/validate";
import HashInput from "@/components/hash_input/HashInput";

const prfsSDK = new PrfsSDK("prfs-proof");

enum CreateProofStatus {
  Loaded,
  InProgress,
}

const CreateProofModule: React.FC<CreateProofModuleProps> = ({ proofType, handleCreateProof }) => {
  const i18n = React.useContext(i18nContext);

  const [systemMsg, setSystemMsg] = React.useState("Loading driver...");
  const [createProofStatus, setCreateProofStatus] = React.useState(CreateProofStatus.Loaded);
  const [terminalLog, setTerminalLog] = React.useState<string>("");
  const [formValues, setFormValues] = React.useState<Record<string, any>>({});
  const [proofGenElement, setProofGenElement] = React.useState<ProofGenElement | null>(null);

  const { mutateAsync: getPrfsAssetMetaRequest } = useMutation({
    mutationFn: (req: GetPrfsAssetMetaRequest) => {
      return prfsAssetApi("get_prfs_asset_meta", req);
    },
  });

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

  const handleClickCreateProof = React.useCallback(async () => {
    if (proofGenElement) {
      try {
        const newFormValues = await validateInputs(formValues, proofType);

        setCreateProofStatus(CreateProofStatus.InProgress);
        proofGenEventListener("debug", `Process starts in 3 seconds`);

        await delay(3000);

        const proveReceipt = await proofGenElement.createProof(newFormValues);
        proofGenEventListener("info", `Proof created in ${proveReceipt.duration}ms`);

        handleCreateProof(null, proveReceipt);
      } catch (err) {
        handleCreateProof(err, null);
      }
    }
  }, [formValues, proofType, handleCreateProof, proofGenElement]);

  React.useEffect(() => {
    async function fn() {
      const { circuit_driver_id, driver_properties } = proofType;

      try {
        const elem = await prfsSDK.create("proof-gen", {
          proofTypeId: proofType.proof_type_id,
          circuit_driver_id,
          driver_properties,
          sdkEndpoint: process.env.NEXT_PUBLIC_PRFS_SDK_WEB_ENDPOINT,
          proofGenEventListener: proofGenEventListener,
        });

        console.log("created");

        elem.subscribe(msg => {
          // console.log(11, msg);
          setSystemMsg(msg.data);
        });

        setProofGenElement(elem);
      } catch (err) {
        setSystemMsg(`Driver init failed, id: ${circuit_driver_id}, err: ${err}`);
      }
    }

    fn().then();
  }, [proofType, setProofGenElement, setSystemMsg, setCreateProofStatus, getPrfsAssetMetaRequest]);

  const circuitInputsElem = React.useMemo(() => {
    if (!proofGenElement) {
      return null;
    }

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
        case "HASH_DATA_1": {
          entriesElem.push(
            <HashInput
              key={idx}
              circuitInput={input}
              value={formValues[input.name] as any}
              setFormValues={setFormValues}
              proofGenElement={proofGenElement}
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
  }, [proofType, formValues, setFormValues, proofGenElement]);

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
      </div>

      <div className={styles.createProofBtn}>
        <Button variant="aqua_blue_1" handleClick={handleClickCreateProof}>
          {i18n.create_proof.toUpperCase()}
        </Button>
      </div>
    </div>
  );
};

export default CreateProofModule;

export interface CreateProofModuleProps {
  proofType: PrfsProofType;
  handleCreateProof: (err: any, proveReceipt: ProveReceipt | null) => void;
}
