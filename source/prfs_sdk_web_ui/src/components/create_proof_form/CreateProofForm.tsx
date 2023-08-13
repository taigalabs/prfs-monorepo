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
import { GetAddressMsg, GetSignatureMsg, sendMsgToParent } from "@taigalabs/prfs-sdk-web";
import Button from "@taigalabs/prfs-react-components/src/button/Button";

import styles from "./CreateProofForm.module.scss";
import { initDriver, interpolateSystemAssetEndpoint } from "@/functions/circuitDriver";
import { i18nContext } from "@/contexts/i18n";
import { useInterval } from "@/functions/interval";
import WalletSelect, { WalletTypeValue } from "@/components/wallet_select/WalletSelect";

const ASSET_SERVER_ENDPOINT = process.env.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT;

const SigDataInput: React.FC<SigDataInputProps> = ({ input, value, setFormValues }) => {
  const i18n = React.useContext(i18nContext);

  React.useEffect(() => {
    if (value === undefined) {
      const defaultSigData: SigData = {
        msgRaw: "default message",
        msgHash: Buffer.from(""),
        sig: "",
      };

      setFormValues(oldVals => {
        return {
          ...oldVals,
          [input.label]: defaultSigData,
        };
      });
    }
  }, [value, setFormValues]);

  const handleClickSign = React.useCallback(async () => {
    if (value) {
      const msgRaw = value.msgRaw;
      const msgHash = Buffer.from(msgRaw);
      const sig = await sendMsgToParent(new GetSignatureMsg(msgHash));

      setFormValues(oldVals => ({
        ...oldVals,
        [input.label]: {
          msgRaw,
          msgHash,
          sig,
        },
      }));
    }
  }, [value, setFormValues]);

  return (
    <div className={styles.sigDataInputWrapper}>
      <input placeholder={input.desc} value={value?.msgRaw || ""} readOnly />
      <div className={styles.btnGroup}>
        <p className={styles.signed}>{value?.sig ? i18n.signed : ""}</p>
        <button className={styles.connectBtn} onClick={handleClickSign}>
          {i18n.sign}
        </button>
      </div>
    </div>
  );
};

const MerkleProofInput: React.FC<SigDataInputProps> = ({ input, value, setFormValues }) => {
  const i18n = React.useContext(i18nContext);

  const handleClickCreate = React.useCallback(async () => {
    // if (value) {
    //   await sendMsgToParent(new GetSignatureMsg(value.msgHash));
    // }
  }, [value, setFormValues]);

  return (
    <div className={styles.merkleProofInputWrapper}>
      <input placeholder={input.desc} value={value?.msgRaw || ""} readOnly />
      <div className={styles.btnGroup}>
        <button className={styles.connectBtn} onClick={handleClickCreate}>
          {i18n.create}
        </button>
      </div>
    </div>
  );
};

const ProofGen: React.FC<ProofGenProps> = ({ proofType, formHeight }) => {
  const i18n = React.useContext(i18nContext);

  const [systemMsg, setSystemMsg] = React.useState("");
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
    (ev: React.ChangeEvent) => {
      console.log(123, ev.target);
      // setSelectedWalletType(val);
    },
    [setSelectedWalletType]
  );

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
    fn().then();
  }, [proofType, setSystemMsg, setDriver]);

  useInterval(
    () => {
      setProveTime(prev => prev + 1);
    },
    isTimerRunning ? 1000 : null
  );

  const circuitInputsElem = React.useMemo(() => {
    const obj: Record<any, CircuitInput> = proofType.circuit_inputs;

    const entriesElem = Object.entries(obj).map(([key, val]) => {
      let inputElem: React.ReactElement;
      // let inputEleme
      switch (val.type) {
        case "MERKLE_PROOF_1": {
          inputElem = (
            <MerkleProofInput
              input={val}
              value={formValues[val.label] as any}
              setFormValues={setFormValues}
            />
          );
          break;
        }
        case "SIG_DATA_1": {
          inputElem = (
            <SigDataInput
              input={val}
              value={formValues[val.label] as any}
              setFormValues={setFormValues}
            />
          );
          break;
        }
        default: {
          inputElem = <PiCalculatorLight />;
        }
      }

      return (
        <div className={styles.circuitInputEntry} key={key}>
          <div className={styles.entryMeta}>
            <div className={styles.entryLabel}>{val.label}</div>
          </div>
          {inputElem}
          {/* <input className={styles.entryValue} /> */}
        </div>
      );
    });

    return entriesElem;
  }, [proofType, formValues, setFormValues]);

  const handleClickCreateProof = React.useCallback(async () => {
    if (!driver) {
      return;
    }

    if (proofType === undefined) {
      return;
    }

    const addr = await sendMsgToParent(new GetAddressMsg(""));
    console.log("my address: %s", addr);

    if (!proofType.circuit_inputs[4].ref) {
      throw new Error("set id (ref) is not defined");
    }

    const setId = proofType.circuit_inputs[4].ref;

    let payload;
    try {
      payload = (
        await prfsApi.getPrfsTreeLeafNodes({
          set_id: setId,
          leaf_vals: [addr],
        })
      ).payload;
    } catch (err) {
      return;
    }

    let pos_w = null;
    for (const node of payload.prfs_tree_nodes) {
      if (node.val === addr.toLowerCase()) {
        pos_w = node.pos_w;
      }
    }

    if (pos_w === null) {
      throw new Error("Address is not part of a set");
    }

    const leafIdx = Number(pos_w);
    const siblingPath = makeSiblingPath(32, leafIdx);
    const pathIndices = makePathIndices(32, leafIdx);

    const siblingPos = siblingPath.map((pos_w, idx) => {
      return { pos_h: idx, pos_w };
    });

    console.log("leafIdx: %o, siblingPos: %o", leafIdx, siblingPos);

    try {
      payload = (
        await prfsApi.getPrfsTreeNodes({
          set_id: setId,
          pos: siblingPos,
        })
      ).payload;
    } catch (err) {
      return;
    }

    let siblings: BigInt[] = [];
    for (const node of payload.prfs_tree_nodes) {
      siblings[node.pos_h] = BigInt(node.val);
    }

    for (let idx = 0; idx < 32; idx += 1) {
      if (siblings[idx] === undefined) {
        siblings[idx] = BigInt(0);
      }
    }

    let merkleProof = {
      root: BigInt(proofType.circuit_inputs[4].value),
      siblings,
      pathIndices,
    };

    // console.log(55, merkleProof);

    const msgRaw = "harry potter";
    const msg = Buffer.from(msgRaw);
    const msgHash = hashPersonalMessage(msg);
    const sig = await sendMsgToParent(new GetSignatureMsg(msgHash));

    const sigData = {
      msgRaw,
      msgHash,
      sig,
    };

    let recoveredAddr = ethers.utils.verifyMessage(msg, sig);
    if (addr !== recoveredAddr) {
      console.error("Address in the signature is invalid");
      return;
    }

    console.log("Proving...");
    setIsTimerRunning(true);

    const prevTime = performance.now();
    const { proof, publicInput } = await driver.prove({
      inputs: {
        sigData,
        merkleProof,
      },
      circuitType: "MEMBERSHIP_PROOF_1",
      eventListener: (msg: string) => {
        console.log("driver event", msg);
      },
    });

    const now = performance.now();
    const diff = now - prevTime;

    console.log("publicInput %o", publicInput);

    setIsTimerRunning(false);
    console.log("Proof gen complete, duration: %s", diff);
    console.log("Raw proof size (excluding public input)", proof.length, "bytes");

    // await driver.verify();

    // setMsg(`Created a proof in ${diff} ms`);
  }, [proofType, setMsg, driver, setIsTimerRunning]);

  return (
    proofType && (
      <div className={styles.wrapper} style={{ height: formHeight - 6 }}>
        <WalletSelect
          selectedVal={selectedWalletType}
          handleSelectVal={handleSelectWalletType}
          walletAddr={walletAddr}
          setWalletAddr={setWalletAddr}
        />
        <div className={styles.circuitInputs}>{circuitInputsElem}</div>
        <div className={styles.btnRow}>
          <Button variant="b" handleClick={handleClickCreateProof} disabled={!driver}>
            {i18n.create_proof}
          </Button>
        </div>
        <div className={styles.systemMsg}>
          <div>{systemMsg}</div>
        </div>
      </div>
    )
  );
};

export default ProofGen;

export interface ProofGenProps {
  proofType: PrfsProofType;
  formHeight: number;
  // handleCreateProof: (proof: Uint8Array, publicInput: any) => void;
}

export interface SigData {
  msgRaw: string;
  msgHash: Buffer;
  sig: string;
}

export interface SigDataInputProps {
  input: CircuitInput;
  value: SigData | undefined;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}
