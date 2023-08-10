import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { PublicInputInstanceEntry } from "@taigalabs/prfs-entities/bindings/PublicInputInstanceEntry";
import { hashPersonalMessage } from "@ethereumjs/util";
import { ethers } from "ethers";
import { makePathIndices, makeSiblingPath } from "@taigalabs/prfs-crypto-js";
// import { CircuitDriver } from "@taigalabs/prfs-driver-interface";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PiCalculatorLight } from "react-icons/pi";
import { HiOutlineDocumentText } from "react-icons/hi2";

import styles from "./CreateProofForm.module.scss";
import i18n from "@/i18n/en";
import Button from "@/components/button/Button";
import {
  CreateProofMsg,
  GetAddressMsg,
  GetSignatureMsg,
  MsgType,
  sendMsgToParent,
} from "@taigalabs/prfs-sdk-web";
import { CircuitDriver } from "@taigalabs/prfs-driver-interface";

const ProofGen: React.FC<ProofGenProps> = ({ proofType }) => {
  const [msg, setMsg] = React.useState("");
  const [time, setTime] = React.useState(0);
  const [running, setRunning] = React.useState(false);

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
    if (proofType === undefined) {
      return;
    }

    const addr = await sendMsgToParent(new GetAddressMsg(""));
    console.log("my address: %s", addr);

    if (!proofType.public_input_instance[4].ref) {
      throw new Error("set id (ref) is not defined");
    }

    const setId = proofType.public_input_instance[4].ref;

    let { payload } = await prfsApi.getPrfsTreeLeafNodes({
      set_id: setId,
      leaf_vals: [addr],
    });

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

    const prfsTreeNodesData = await prfsApi.getPrfsTreeNodes({
      set_id: setId,
      pos: siblingPos,
    });

    let siblings: BigInt[] = [];
    for (const node of prfsTreeNodesData.payload.prfs_tree_nodes) {
      siblings[node.pos_h] = BigInt(node.val);
    }

    for (let idx = 0; idx < 32; idx += 1) {
      if (siblings[idx] === undefined) {
        siblings[idx] = BigInt(0);
      }
    }

    const { driver_id, driver_properties } = proofType;
    console.log(12, proofType.driver_properties);

    let driverProperties = interpolateSystemAssetEndpoint(driver_properties);
    console.log(13, driverProperties);

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

    const prevTime = performance.now();
    const now = performance.now();
    const diff = now - prevTime;

    const driver = await initDriver(driver_id, driverProperties);

    console.log("Proving...");
    console.time("Full proving time");
    const { proof, publicInput } = await driver.prove(sig, msgHash, merkleProof);

    console.timeEnd("Full proving time");
    console.log("Raw proof size (excluding public input)", proof.length, "bytes");

    // setMsg(`Created a proof in ${diff} ms`);
  }, [proofType, setMsg]);

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
          <Button variant="b" handleClick={handleClickCreateProof}>
            {i18n.create_proof}
          </Button>
          <div>{msg}</div>
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

function interpolateSystemAssetEndpoint(
  driverProperties: Record<string, any>
): Record<string, any> {
  const ret = {};

  for (const key in driverProperties) {
    const val = driverProperties[key];
    ret[key] = val.replace("prfs:/", process.env.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT);
  }

  return ret;
}

async function initDriver(
  driverId: string,
  driverProps: Record<string, any>
): Promise<CircuitDriver> {
  switch (driverId) {
    case "SPARTAN_CIRCOM_1": {
      const mod = await import("@taigalabs/prfs-driver-spartan-js");
      const driver = await mod.default.newInstance(driverProps);
      return driver;
    }
    default:
      throw new Error(`This driver is not supported, ${driverId}`);
  }
}
