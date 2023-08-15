import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import cn from "classnames";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { hashPersonalMessage } from "@ethereumjs/util";
import { ethers } from "ethers";
import { makePathIndices, makeSiblingPath } from "@taigalabs/prfs-crypto-js";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PiCalculatorLight } from "react-icons/pi";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { CircuitDriver } from "@taigalabs/prfs-driver-interface";
import {
  GetAddressMsg,
  GetSignatureMsg,
  ListenClickOutsideMsg,
  MsgType,
  StopClickOutsideMsg,
  sendMsgToParent,
} from "@taigalabs/prfs-sdk-web";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Popover from "@taigalabs/prfs-react-components/src/popover/Popover";
import { PROOF_GEN_IFRAME_ID } from "@taigalabs/prfs-sdk-web";

import styles from "./MerkleProofInput.module.scss";
import { initDriver, interpolateSystemAssetEndpoint } from "@/functions/circuitDriver";
import { i18nContext } from "@/contexts/i18n";
import { useInterval } from "@/functions/interval";
import WalletSelect, { WalletTypeValue } from "@/components/wallet_select/WalletSelect";
import { PRFS_SDK_CLICK_OUTSIDE_EVENT_TYPE } from "@taigalabs/prfs-sdk-web/src/proof_gen_element/click";

const MerkleProofModal: React.FC<MerkleProofModalProps> = ({
  walletAddr,
  setIsOpen,
  circuitInput,
}) => {
  console.log(22, walletAddr);

  const i18n = React.useContext(i18nContext);

  React.useEffect(() => {
    async function fn() {
      sendMsgToParent(new ListenClickOutsideMsg());

      window.addEventListener("message", (ev: MessageEvent) => {
        const { type } = ev.data;

        if (type && type === PRFS_SDK_CLICK_OUTSIDE_EVENT_TYPE) {
          setIsOpen(false);
        }
      });
    }

    fn().then();

    return () => {
      sendMsgToParent(new StopClickOutsideMsg());
    };
  }, []);

  const handleCreateMerkleProof = React.useCallback(async () => {
    if (walletAddr.length < 1) {
      return;
    }

    const setId = circuitInput.value;

    try {
      const leafNodesData = await prfsApi.getPrfsTreeLeafNodes({
        set_id: setId,
        leaf_vals: [walletAddr],
      });

      let pos_w = null;
      for (const node of leafNodesData.payload.prfs_tree_nodes) {
        if (node.val === walletAddr.toLowerCase()) {
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

      const siblingNodesData = await prfsApi.getPrfsTreeNodes({
        set_id: setId,
        pos: siblingPos,
      });

      let siblings: BigInt[] = [];
      for (const node of siblingNodesData.payload.prfs_tree_nodes) {
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
    } catch (err) {}
  }, [circuitInput, walletAddr]);

  return (
    <div className={styles.popoverWrapper}>
      <div>
        <p>{i18n.wallet_address}</p>
        <div className={styles.addrInputBox}>
          <input className={styles.addrInput} value={walletAddr} readOnly />
        </div>
      </div>
      <div className={styles.popoverBtnRow}>
        <button onClick={handleCreateMerkleProof}>{i18n.create_merkle_proof_label}</button>
        <span> {circuitInput.value}</span>
      </div>
    </div>
  );
};

const MerkleProofInput: React.FC<MerkleProofInputProps> = ({
  walletAddr,
  circuitInput,
  value,
  setFormValues,
}) => {
  const i18n = React.useContext(i18nContext);

  const handleClickCreate = React.useCallback(async () => {
    // console.log("handle click");
  }, [value, setFormValues]);

  const createBase = React.useCallback((isOpen: boolean) => {
    return (
      <div>
        <button
          className={cn({
            [styles.createBtn]: true,
            [styles.isOpen]: isOpen,
          })}
          onClick={handleClickCreate}
        >
          {i18n.create}
        </button>
      </div>
    );
  }, []);

  const createPopover = React.useCallback(
    (setIsOpen: React.Dispatch<React.SetStateAction<any>>) => {
      return (
        <MerkleProofModal
          walletAddr={walletAddr}
          setIsOpen={setIsOpen}
          circuitInput={circuitInput}
        />
      );
    },
    [circuitInput, walletAddr]
  );

  return (
    <div className={styles.wrapper}>
      <input placeholder={circuitInput.desc} value={value?.msgRaw || ""} readOnly />
      <div className={styles.btnGroup}>
        <button className={styles.rawBtn}>Raw</button>
        <Popover createBase={createBase} createPopover={createPopover} />
      </div>
    </div>
  );
};

export default MerkleProofInput;

export interface MerkleProofInputProps {
  walletAddr: string;
  circuitInput: CircuitInput;
  value: any | undefined;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export interface MerkleProofModalProps {
  walletAddr: string;
  circuitInput: CircuitInput;
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
}
