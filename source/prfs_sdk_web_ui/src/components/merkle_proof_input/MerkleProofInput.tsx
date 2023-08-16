import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import cn from "classnames";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { hashPersonalMessage } from "@ethereumjs/util";
import { ethers } from "ethers";
import { makePathIndices, makeSiblingPath } from "@taigalabs/prfs-crypto-js";
import * as prfsApi from "@taigalabs/prfs-api-js";
import {
  ListenClickOutsideMsg,
  MsgType,
  StopClickOutsideMsg,
  sendMsgToParent,
} from "@taigalabs/prfs-sdk-web";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Popover from "@taigalabs/prfs-react-components/src/popover/Popover";
import { PROOF_GEN_IFRAME_ID } from "@taigalabs/prfs-sdk-web";
import { PRFS_SDK_CLICK_OUTSIDE_EVENT_TYPE } from "@taigalabs/prfs-sdk-web/src/proof_gen_element/outside_event";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";

import styles from "./MerkleProofInput.module.scss";
import { initDriver, interpolateSystemAssetEndpoint } from "@/functions/circuitDriver";
import { i18nContext } from "@/contexts/i18n";
import { SpartanMerkleProof } from "@taigalabs/prfs-driver-spartan-js";

const MerkleProofModal: React.FC<MerkleProofModalProps> = ({
  prfsSet,
  walletAddr,
  setIsOpen,
  circuitInput,
  setFormValues,
}) => {
  const i18n = React.useContext(i18nContext);

  React.useEffect(() => {
    sendMsgToParent(new ListenClickOutsideMsg());

    function eventListener(ev: MessageEvent) {
      const { type } = ev.data;

      if (type && type === PRFS_SDK_CLICK_OUTSIDE_EVENT_TYPE) {
        setIsOpen(false);
      }
    }

    window.addEventListener("message", eventListener);

    return () => {
      sendMsgToParent(new StopClickOutsideMsg());
      window.removeEventListener("message", eventListener);
    };
  }, []);

  const handleCreateMerkleProof = React.useCallback(async () => {
    if (walletAddr.length < 1) {
      return;
    }

    if (!prfsSet) {
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

      const merkleProof: SpartanMerkleProof = {
        root: BigInt(prfsSet.merkle_root),
        siblings: siblings as bigint[],
        pathIndices,
      };

      setFormValues((prevVals: any) => {
        return {
          ...prevVals,
          [circuitInput.name]: merkleProof,
        };
      });

      setIsOpen(false);
    } catch (err) {}
  }, [circuitInput, walletAddr, prfsSet, setFormValues, setIsOpen]);

  return (
    <div className={styles.popoverWrapper}>
      <div>
        <p>{i18n.wallet_address}</p>
        <div className={styles.addrInputBox}>
          <input className={styles.addrInput} value={walletAddr} readOnly />
        </div>
      </div>
      <div className={styles.popoverBtnRow}>
        <div>
          <button onClick={handleCreateMerkleProof}>{i18n.create_merkle_proof_label}</button>
          <span> {circuitInput.value}</span>
        </div>
        <div>
          <button disabled>{i18n.edit_raw}</button>
        </div>
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
  const [prfsSet, setPrfsSet] = React.useState<PrfsSet>();

  const handleClickCreate = React.useCallback(async () => {
    // console.log("handle click");
  }, [value, setFormValues]);

  React.useEffect(() => {
    async function fn() {
      if (circuitInput.ref === "PRFS_SET") {
        const { payload } = await prfsApi.getSets({ page: 0, set_id: circuitInput.value });

        if (payload.prfs_sets.length > 0) {
          const prfsSet = payload.prfs_sets[0];
          setPrfsSet(prfsSet);
        } else {
          console.error("Prfs set not found");
        }
      }
    }

    fn().then();
  }, [circuitInput, setPrfsSet]);

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
          prfsSet={prfsSet}
          walletAddr={walletAddr}
          setIsOpen={setIsOpen}
          circuitInput={circuitInput}
          setFormValues={setFormValues}
        />
      );
    },
    [circuitInput, walletAddr, prfsSet]
  );

  return (
    prfsSet && (
      <div className={styles.wrapper}>
        <input
          placeholder={`${prfsSet.set_id} / ${circuitInput.desc}`}
          value={value?.msgRaw || ""}
          readOnly
        />
        <div className={styles.btnGroup}>
          <Popover createBase={createBase} createPopover={createPopover} />
        </div>
      </div>
    )
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
  prfsSet: PrfsSet | undefined;
  walletAddr: string;
  circuitInput: CircuitInput;
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}
