import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { PublicInputInstanceEntry } from "@taigalabs/prfs-entities/bindings/PublicInputInstanceEntry";
import { hashPersonalMessage } from "@ethereumjs/util";
import { ethers } from "ethers";
import { makePathIndices, makeSiblingPath } from "@taigalabs/prfs-crypto-js";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PiCalculatorLight } from "react-icons/pi";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { CircuitDriver } from "@taigalabs/prfs-driver-interface";
import { GetAddressMsg, GetSignatureMsg, MsgType, sendMsgToParent } from "@taigalabs/prfs-sdk-web";

import styles from "./CreateProofForm.module.scss";
import i18n from "@/i18n/en";
import Button from "@/components/button/Button";
import { initDriver, interpolateSystemAssetEndpoint } from "@/functions/circuitDriver";
import { i18nContext } from "@/contexts/i18n";
import { useInterval } from "@/functions/interval";

const ASSET_SERVER_ENDPOINT = process.env.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT;

const ProofGen: React.FC<ProofGenProps> = ({ proofType }) => {
  const i18n = React.useContext(i18nContext);

  const [systemMsg, setSystemMsg] = React.useState("");
  const [msg, setMsg] = React.useState("");
  const [proveTime, setProveTime] = React.useState<number>(0);
  const [driver, setDriver] = React.useState<CircuitDriver>();
  const [isRunning, setIsRunning] = React.useState(false);

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
    isRunning ? 1000 : null
  );

  const publicInputElem = React.useMemo(() => {
    const obj: Record<any, PublicInputInstanceEntry> = proofType.public_input_instance;

    const entriesElem = Object.entries(obj).map(([key, val]) => {
      let typeElem: React.ReactElement;
      switch (val.type) {
        case "PROVER_GENERATED": {
          typeElem = <PiCalculatorLight />;
          break;
        }
        case "PRFS_SET": {
          typeElem = <HiOutlineDocumentText />;
          break;
        }
        default: {
          throw new Error(`public input type is wrong, type: ${val.type}`);
        }
      }

      return (
        <div className={styles.publicInputEntry} key={key}>
          <div className={styles.entryMeta}>
            <div className={styles.entryKey}>{key}</div>
            <div className={styles.entryType}>{typeElem}</div>
            <div className={styles.entryLabel}>{val.label}</div>
          </div>
          <div className={styles.entryValue}>{val.value}</div>
        </div>
      );
    });

    return entriesElem;
  }, [proofType]);

  const handleClickCreateProof = React.useCallback(async () => {
    if (!driver) {
      return;
    }

    if (proofType === undefined) {
      return;
    }

    const addr = await sendMsgToParent(new GetAddressMsg(""));
    console.log("my address: %s", addr);

    if (!proofType.public_input_instance[4].ref) {
      throw new Error("set id (ref) is not defined");
    }

    const setId = proofType.public_input_instance[4].ref;

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
      root: BigInt(proofType.public_input_instance[4].value),
      siblings,
      pathIndices,
    };

    console.log(55, merkleProof);

    const msg = Buffer.from("harry potter");
    const msgHash = hashPersonalMessage(msg);

    const sig = await sendMsgToParent(new GetSignatureMsg(msg));
    console.log("sig", sig);

    let verifyMsg = ethers.utils.verifyMessage(msg, sig);
    console.log("verified addr", verifyMsg);

    console.log(55, driver);

    console.log("Proving...");
    setIsRunning(true);

    const prevTime = performance.now();
    const { proof, publicInput } = await driver.prove({
      inputs: {
        sig,
        msgHash,
        merkleProof,
      },
      eventListener: (msg: string) => {
        console.log("driver event", msg);
      },
    });

    const now = performance.now();
    const diff = now - prevTime;

    console.log("publicInput %o", publicInput);

    setIsRunning(false);
    console.log("Proof gen complete, duration: %s", diff);
    console.log("Raw proof size (excluding public input)", proof.length, "bytes");

    // setMsg(`Created a proof in ${diff} ms`);
  }, [proofType, setMsg, driver, setIsRunning]);

  return (
    proofType && (
      <div className={styles.wrapper}>
        <div className={styles.privateInputs}>
          <div className={styles.inputCategoryTitle}>{i18n.private_inputs}</div>
          <div className={styles.inputEntries}></div>
        </div>
        <div className={styles.publicInputInstance}>
          <div className={styles.inputCategoryTitle}>{i18n.public_inputs}</div>
          <div className={styles.inputEntries}>{publicInputElem}</div>
        </div>
        <div className={styles.btnRow}>
          <Button variant="b" handleClick={handleClickCreateProof} disabled={!driver}>
            {i18n.create_proof}
          </Button>
          <div>{proveTime}</div>
          <div>{msg}</div>
          <div className={styles.systemMsg}>{systemMsg}</div>
        </div>
      </div>
    )
  );
};

export default ProofGen;

export interface ProofGenProps {
  proofType: PrfsProofType;
  // handleCreateProof: (proof: Uint8Array, publicInput: any) => void;
}
