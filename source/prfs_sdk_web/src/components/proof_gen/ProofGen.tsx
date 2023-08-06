import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { PublicInputInstanceEntry } from "@taigalabs/prfs-entities/bindings/PublicInputInstanceEntry";
import { hashPersonalMessage } from "@ethereumjs/util";
import { ethers } from "ethers";
import { makePathIndices, makeSiblingPath } from "@taigalabs/prfs-crypto-js";
import { CircuitDriver } from "@taigalabs/prfs-driver-interface";
import { ThirdwebProvider, useSigner, useWallet } from "@thirdweb-dev/react";
import * as prfsApi from "@taigalabs/prfs-api-js";

import i18n from "../../i18n/en";
import styles from "./ProofGen.module.scss";
import Button from "../button/Button";

const ProofGen: React.FC<ProofGenProps> = ({ signer, proofType, handleCreateProof }) => {
  // let aaa = useWallet();
  // const signer = useSigner();

  const publicInputElem = React.useMemo(() => {
    const obj: Record<any, PublicInputInstanceEntry> = proofType.public_input_instance;

    // label: string;
    // type: PublicInputType;
    // desc: string;
    // value: string;
    // ref: string | null;
    const entriesElem = Object.entries(obj).map(([key, val]) => {
      return (
        <div className={styles.publicInputEntry} key={key}>
          <div className={styles.entryMeta}>
            <div className={styles.entryKey}>{key}</div>
            <div className={styles.entryType}>{val.type}</div>
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

    console.log(11, proofType);

    const addr = await signer.getAddress();
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
    const siblingPath = makeSiblingPath(32, Number(pos_w));
    const pathIndices = makePathIndices(32, Number(pos_w));

    const siblingPos = siblingPath.map((pos_w, idx) => {
      return { pos_h: idx, pos_w };
    });

    console.log("siblingPos: %o", siblingPos);

    const data = await prfsApi.getPrfsTreeNodes({
      set_id: setId,
      pos: siblingPos,
    });

    console.log(55, data);

    let siblings: BigInt[] = [];
    for (const node of data.payload.prfs_tree_nodes) {
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

    const driver = await initDriver(driver_id, driverProperties);

    // await proveMembership(signer, driver, 4);
    // await proveMembershipMock(driver);

    let merkleProof = {
      root: BigInt(proofType.public_input_instance[4].value),
      siblings,
      pathIndices,
    };

    console.log(55, merkleProof);

    const msg = Buffer.from("harry potter");
    const msgHash = hashPersonalMessage(msg);

    let sig = await signer.signMessage(msg);
    console.log("sig", sig);

    let verifyMsg = ethers.utils.verifyMessage(msg, sig);
    console.log("verified addr", verifyMsg);

    let proverAddress = await signer.getAddress();
    console.log("proverAddr", proverAddress);

    console.log("Proving...");
    console.time("Full proving time");
    const { proof, publicInput } = await driver.prove(sig, msgHash, merkleProof);

    console.timeEnd("Full proving time");
    console.log("Raw proof size (excluding public input)", proof.length, "bytes");

    console.log("Verifying...");

    console.time("Verification time");
    const result = await driver.verify(proof, publicInput.serialize());
    console.timeEnd("Verification time");

    if (result) {
      console.log("Successfully verified proof!");
    } else {
      console.log("Failed to verify proof :(");
    }
  }, [proofType, signer]);

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
        </div>
        <div className={styles.powered}>{i18n.powered_by_prfs_web_sdk}</div>
      </div>
    )
  );
};

export default ProofGen;

export interface ProofGenProps {
  signer: any;
  proofType: PrfsProofType;
  handleCreateProof: Function;
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
