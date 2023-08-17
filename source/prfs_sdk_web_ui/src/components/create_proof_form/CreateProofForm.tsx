import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { hashPersonalMessage } from "@ethereumjs/util";
import { ethers } from "ethers";
import { makePathIndices, makeSiblingPath } from "@taigalabs/prfs-crypto-js";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PiCalculatorLight } from "react-icons/pi";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { CircuitDriver } from "@taigalabs/prfs-driver-interface";
import {
  CreateProofResponseMsg,
  GetAddressMsg,
  GetSignatureMsg,
  ListenCreateProofMsg,
  MsgType,
  sendMsgToParent,
} from "@taigalabs/prfs-sdk-web";

import styles from "./CreateProofForm.module.scss";
import { initDriver, interpolateSystemAssetEndpoint } from "@/functions/circuitDriver";
import { i18nContext } from "@/contexts/i18n";
import { useInterval } from "@/functions/interval";
import WalletSelect, { WalletTypeValue } from "@/components/wallet_select/WalletSelect";
import MerkleProofInput from "@/components/merkle_proof_input/MerkleProofInput";
import SigDataInput from "@/components/sig_data_input/SigDataInput";
import { PRFS_SDK_CRAETE_PROOF_EVENT_TYPE } from "@taigalabs/prfs-sdk-web/src/proof_gen_element/outside_event";
import { createProof } from "@/functions/proof";

const ASSET_SERVER_ENDPOINT = process.env.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT;

const CreateProofForm: React.FC<CreateProofFormProps> = ({ proofType, formHeight }) => {
  const i18n = React.useContext(i18nContext);

  const [systemMsg, setSystemMsg] = React.useState("");
  const [terminalLog, setTerminalLog] = React.useState<React.ReactNode[]>([]);
  const [msg, setMsg] = React.useState("");
  const [proveTime, setProveTime] = React.useState<number>(0);
  const [driver, setDriver] = React.useState<CircuitDriver>();
  const [isTimerRunning, setIsTimerRunning] = React.useState(false);
  const [selectedWalletType, setSelectedWalletType] = React.useState<WalletTypeValue>({
    value: "metamask",
  });
  const [walletAddr, setWalletAddr] = React.useState("");
  const [formValues, setFormValues] = React.useState<Record<string, any>>({});

  const handleSelectWalletType = React.useCallback(
    (_ev: React.ChangeEvent) => {
      // noop
    },
    [setSelectedWalletType]
  );

  React.useEffect(() => {
    async function eventListener(ev: MessageEvent) {
      if (ev.ports.length > 0) {
        const type: MsgType = ev.data.type;

        if (type === MsgType.CREATE_PROOF) {
          validateFormValues(formValues);

          setTerminalLog(oldVal => {
            const elem = <span key={oldVal.length}>Start creating a proof...</span>;

            return [...oldVal, elem];
          });

          // const proof = await createProof(proofType, formValues, walletAddr);
          // ev.ports[0].postMessage(new CreateProofResponseMsg(proof));
        }
      }
    }

    window.addEventListener("message", eventListener);

    return () => {
      window.removeEventListener("message", eventListener);
    };
  }, [proofType, formValues, walletAddr, setTerminalLog]);

  React.useEffect(() => {
    async function fn() {
      setSystemMsg("Loading driver...");

      const { driver_id, driver_properties } = proofType;
      const driverProperties = interpolateSystemAssetEndpoint(
        driver_properties,
        ASSET_SERVER_ENDPOINT
      );
      const driver = await initDriver(driver_id, driverProperties);

      setSystemMsg(`${i18n.driver}: ${driver_id}`);
      setDriver(driver);
    }

    window.setTimeout(() => {
      fn().then();
    }, 1000);
  }, [proofType, setSystemMsg, setDriver]);

  // useInterval(
  //   () => {
  //     setProveTime(prev => prev + 1);
  //   },
  //   isTimerRunning ? 1000 : null
  // );

  const circuitInputsElem = React.useMemo(() => {
    const obj: Record<any, CircuitInput> = proofType.circuit_inputs;

    const entriesElem = Object.entries(obj).map(([key, val]) => {
      let inputElem: React.ReactElement;

      switch (val.type) {
        case "MERKLE_PROOF_1": {
          inputElem = (
            <MerkleProofInput
              walletAddr={walletAddr}
              circuitInput={val}
              value={formValues[val.name] as any}
              setFormValues={setFormValues}
            />
          );
          break;
        }
        case "SIG_DATA_1": {
          inputElem = (
            <SigDataInput
              circuitInput={val}
              value={formValues[val.name] as any}
              setFormValues={setFormValues}
            />
          );
          break;
        }
        default: {
          console.error(`Cannot handle circuit input of this type`);

          inputElem = <input placeholder="Cannot handle circuit input of this type" />;
        }
      }

      return (
        <div className={styles.circuitInputEntry} key={key}>
          <div className={styles.entryMeta}>
            <div className={styles.entryLabel}>{val.label}</div>
          </div>
          <div className={styles.inputContainer}>{inputElem}</div>
        </div>
      );
    });

    return entriesElem;
  }, [proofType, formValues, setFormValues, walletAddr]);

  return (
    proofType && (
      <div className={styles.wrapper}>
        <div className={styles.form} style={{ height: formHeight - 6 }}>
          <div className={styles.inputContainer}>
            <WalletSelect
              selectedWallet={selectedWalletType}
              handleSelectWallet={handleSelectWalletType}
              walletAddr={walletAddr}
              handleChangeWalletAddr={setWalletAddr}
            />
          </div>
          <div className={styles.circuitInputs}>{circuitInputsElem}</div>
          {terminalLog.length > 0 && <div className={styles.terminal}>{terminalLog}</div>}
        </div>

        <div className={styles.footer}>
          <div className={styles.systemMsg}>
            <div>{systemMsg}</div>
          </div>
          <div className={styles.sdkMeta}>
            {i18n.prfs_web_sdk} {process.env.NEXT_PUBLIC_VERSION}
          </div>
        </div>
      </div>
    )
  );
};

export default CreateProofForm;

export interface CreateProofFormProps {
  proofType: PrfsProofType;
  formHeight: number;
  // handleCreateProof: (proof: Uint8Array, publicInput: any) => void;
}

function validateFormValues(_formValues: any) {
  // noop
}
