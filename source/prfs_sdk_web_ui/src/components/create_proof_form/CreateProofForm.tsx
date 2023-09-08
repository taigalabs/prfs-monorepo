import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { CircuitDriver } from "@taigalabs/prfs-driver-interface";
import { Msg, MsgType, sendMsgToParent } from "@taigalabs/prfs-sdk-web";
import WalletSelect, {
  WalletTypeValue,
} from "@taigalabs/prfs-react-components/src/wallet_select/WalletSelect";
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

const ASSET_SERVER_ENDPOINT = envs.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT;

enum CreateProofPage {
  INPUT,
  PROGRESS,
}

const CreateProofForm: React.FC<CreateProofFormProps> = ({ proofType, docHeight }) => {
  const i18n = React.useContext(i18nContext);

  const [systemMsg, setSystemMsg] = React.useState("Loading driver...");
  const [createProofPage, setCreateProofPage] = React.useState(CreateProofPage.INPUT);
  const [terminalLog, setTerminalLog] = React.useState<React.ReactNode[]>([]);
  const [driver, setDriver] = React.useState<CircuitDriver>();
  const [isCompleted, setIsCompleted] = React.useState(false);
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

  const proofGenEventListener = React.useCallback(
    (type: string, msg: string) => {
      setTerminalLog(oldVals => {
        const elem = (
          <p className={type} key={oldVals.length}>
            {msg}
          </p>
        );

        return [...oldVals, elem];
      });
    },
    [setTerminalLog]
  );

  React.useEffect(() => {
    async function eventListener(ev: MessageEvent) {
      if (ev.ports.length > 0) {
        const type: MsgType = ev.data.type;

        if (type === "CREATE_PROOF") {
          if (!driver) {
            return;
          }

          validateFormValues(formValues);

          setCreateProofPage(CreateProofPage.PROGRESS);

          proofGenEventListener("plain", `Process starts in 3 seconds`);

          await delay(3000);

          proofGenEventListener(
            "plain",
            `Start proving... hardware concurrency: ${window.navigator.hardwareConcurrency}`
          );

          try {
            const proveReceipt = await createProof(
              driver,
              formValues,
              walletAddr,
              proofGenEventListener
            );

            proofGenEventListener("plain", `Proof created in ${proveReceipt.duration}ms`);

            // ev.ports[0].postMessage(new CreateProofResponseMsg(proveReceipt));
            ev.ports[0].postMessage(new Msg("CREATE_PROOF_RESPONSE", proveReceipt));
          } catch (err) {}
        }
      }
    }

    window.addEventListener("message", eventListener);

    return () => {
      window.removeEventListener("message", eventListener);
    };
  }, [proofType, formValues, walletAddr, setTerminalLog, setIsCompleted]);

  React.useEffect(() => {
    async function fn() {
      const { circuit_driver_id, driver_properties } = proofType;
      const driverProperties = interpolateSystemAssetEndpoint(
        driver_properties,
        ASSET_SERVER_ENDPOINT
      );

      try {
        const driver = await initDriver(circuit_driver_id, driverProperties);
        setSystemMsg(`${i18n.driver}: ${circuit_driver_id}`);
        setDriver(driver);
      } catch (err) {
        setSystemMsg(`Driver init failed, id: ${circuit_driver_id}, err: ${err}`);
      }
    }

    window.setTimeout(() => {
      fn().then();
    }, 1000);
  }, [proofType, setSystemMsg, setDriver, setCreateProofPage]);

  const handleClickConnectWallet = React.useCallback(async () => {
    const addr = await sendMsgToParent(new Msg("GET_ADDRESS", ""));

    setWalletAddr(addr);
  }, [setWalletAddr]);

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

  if (!proofType) {
    return null;
  }

  return (
    <div className={styles.wrapper} style={{ height: docHeight }}>
      <div
        className={styles.inputPage}
        style={{ opacity: createProofPage === CreateProofPage.INPUT ? 1 : 0 }}
      >
        <div className={styles.form} style={{ height: docHeight }}>
          {/* <div className={styles.inputContainer}> */}
          {/*   <WalletSelect */}
          {/*     selectedWallet={selectedWalletType} */}
          {/*     handleSelectWallet={handleSelectWalletType} */}
          {/*     walletAddr={walletAddr} */}
          {/*     handleChangeWalletAddr={setWalletAddr} */}
          {/*     handleClickConnectWallet={handleClickConnectWallet} */}
          {/*   /> */}
          {/* </div> */}
          {circuitInputsElem}
        </div>
      </div>

      {createProofPage === CreateProofPage.PROGRESS && (
        <div className={styles.terminalPage}>
          <Fade>
            <CreateProofProgress terminalLog={terminalLog} isCompleted={isCompleted} />
          </Fade>
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.systemMsg}>
          <span>{systemMsg}</span>
        </div>
        <div className={styles.sdkMeta}>
          {i18n.prfs_web_sdk} {envs.NEXT_PUBLIC_VERSION}
        </div>
      </div>
    </div>
  );
};

export default CreateProofForm;

export interface CreateProofFormProps {
  proofType: PrfsProofType;
  docHeight: number;
  // handleCreateProof: (proof: Uint8Array, publicInput: any) => void;
}

function validateFormValues(_formValues: any) {
  // noop
}
