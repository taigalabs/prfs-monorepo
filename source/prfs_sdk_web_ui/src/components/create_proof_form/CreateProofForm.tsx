import { createSignal, type Component, createMemo, JSX } from "solid-js";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { PublicInputInstanceEntry } from "@taigalabs/prfs-entities/bindings/PublicInputInstanceEntry";
import { hashPersonalMessage } from "@ethereumjs/util";
import { ethers } from "ethers";
import { makePathIndices, makeSiblingPath } from "@taigalabs/prfs-crypto-js";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { RiDocumentFileListLine } from "solid-icons/ri";
import { IoCalculatorSharp } from "solid-icons/io";

import styles from "./CreateProofForm.module.scss";
import { i18n, I18nContext } from "@/contexts/i18n";
import Button from "@/components/button/Button";
import {
  CreateProofMsg,
  GetAddressMsg,
  GetSignatureMsg,
  MsgType,
  sendMsgToParent,
} from "@taigalabs/prfs-sdk-web";

const CreateProofForm: Component<CreateProofFormProps> = ({ proofType }) => {
  const [msg, setMsg] = createSignal("");
  const [time, setTime] = createSignal(0);
  const [running, setRunning] = createSignal(false);

  console.log(1313, proofType);

  const publicInputElem = createMemo(() => {
    const obj: Record<any, PublicInputInstanceEntry> = proofType.public_input_instance;

    const entriesElem = Object.entries(obj).map(([key, val]) => {
      let typeElem: JSX.Element;
      switch (val.type) {
        case "PROVER_GENERATED": {
          typeElem = <IoCalculatorSharp />;
          break;
        }
        case "PRFS_SET": {
          typeElem = <RiDocumentFileListLine />;
          break;
        }
        default: {
          throw new Error(`public input type is wrong, type: ${val.type}`);
        }
      }

      return (
        <div class={styles.publicInputEntry}>
          <div class={styles.entryMeta}>
            <div class={styles.entryKey}>{key}</div>
            <div class={styles.entryType}>{typeElem}</div>
            <div class={styles.entryLabel}>{val.label}</div>
          </div>
          <div class={styles.entryValue}>{val.value}</div>
        </div>
      );
    });

    return entriesElem;
  }, [proofType]);

  const handleClickCreateProof = createMemo(() => {
    return async () => {
      if (proofType === undefined) {
        return;
      }

      const addr = await sendMsgToParent(new GetAddressMsg(""));
      console.log("my address: %s", addr);

      if (!proofType.public_input_instance[4].ref) {
        throw new Error("set id (ref) is not defined");
      }

      const setId = proofType.public_input_instance[4].ref;

      let getPrfsTreeLeafNodesResp = await prfsApi.getPrfsTreeLeafNodes({
        set_id: setId,
        leaf_vals: [addr],
      });

      if (!getPrfsTreeLeafNodesResp) {
        return;
      }

      let pos_w = null;
      for (const node of getPrfsTreeLeafNodesResp.payload.prfs_tree_nodes) {
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

      const prfsTreeNodesDataResp = await prfsApi.getPrfsTreeNodes({
        set_id: setId,
        pos: siblingPos,
      });

      if (!prfsTreeNodesDataResp) {
        return;
      }

      let siblings: BigInt[] = [];
      for (const node of prfsTreeNodesDataResp.payload.prfs_tree_nodes) {
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
      let resp = await sendMsgToParent(
        new CreateProofMsg(sig, msgHash, merkleProof, driver_id, driverProperties)
      );
      const now = performance.now();
      const diff = now - prevTime;

      console.log("Created a proof: %o, diff: %s,", resp, diff);

      setMsg(`Created a proof in ${diff} ms`);
    };
  });

  return (
    proofType && (
      <div class={styles.wrapper}>
        <div class={styles.privateInputs}>
          <div class={styles.inputCategoryTitle}>{i18n.private_inputs}</div>
          <div class={styles.inputEntries}></div>
        </div>
        <div class={styles.publicInputInstance}>
          <div class={styles.inputCategoryTitle}>{i18n.public_inputs}</div>
          <div class={styles.inputEntries}>{publicInputElem()}</div>
        </div>
        <div class={styles.btnRow}>
          <Button variant="b" handleClick={handleClickCreateProof}>
            {i18n.create_proof}
          </Button>
          <div>{msg()}</div>
        </div>
      </div>
    )
  );
};

export default CreateProofForm;

export interface CreateProofFormProps {
  proofType: PrfsProofType;
  // handleCreateProof: (proof: Uint8Array, publicInput: any) => void;
}

function interpolateSystemAssetEndpoint(
  driverProperties: Record<string, any>
): Record<string, any> {
  const ret: Record<string, any> = {};

  for (const key in driverProperties) {
    const val = driverProperties[key];
    ret[key] = val.replace("prfs:/", process.env.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT);
  }

  return ret;
}

// async function initDriver(
//   driverId: string,
//   driverProps: Record<string, any>
// ): Promise<CircuitDriver> {
//   switch (driverId) {
//     case "SPARTAN_CIRCOM_1": {
//       const mod = await import("@taigalabs/prfs-driver-spartan-js");
//       const driver = await mod.default.newInstance(driverProps);
//       return driver;
//     }
//     default:
//       throw new Error(`This driver is not supported, ${driverId}`);
//   }
// }
