import ReactDom from "react-dom/server";
import React from "react";
import cn from "classnames";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { makePathIndices, makeSiblingPath } from "@taigalabs/prfs-crypto-js";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import {
  Msg,
  // ListenClickOutsideMsg,
  // StopClickOutsideMsg,
  sendMsgToParent,
} from "@taigalabs/prfs-sdk-web";
import Popover from "@taigalabs/prfs-react-components/src/popover/Popover";
import { PRFS_SDK_CLICK_OUTSIDE_EVENT_TYPE } from "@taigalabs/prfs-sdk-web/src/proof_gen_element/outside_event";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import { SpartanMerkleProof } from "@taigalabs/prfs-driver-spartan-js";

import styles from "./MerkleProofInput.module.scss";
import { i18nContext } from "@/contexts/i18n";

const MerkleProofModal: React.FC<MerkleProofModalProps> = ({
  prfsSet,
  walletAddr,
  setIsOpen,
  circuitInput,
  setFormValues,
}) => {
  const i18n = React.useContext(i18nContext);

  React.useEffect(() => {
    sendMsgToParent(new Msg("LISTEN_CLICK_OUTSIDE", undefined));

    function eventListener(ev: MessageEvent) {
      const { type } = ev.data;

      if (type && type === PRFS_SDK_CLICK_OUTSIDE_EVENT_TYPE) {
        setIsOpen(false);
      }
    }

    window.addEventListener("message", eventListener);

    return () => {
      sendMsgToParent(new Msg("STOP_CLICK_OUTSIDE", undefined));
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

    const { set_id } = prfsSet;

    if (!set_id) {
      console.error("set id is not provided");
      return;
    }

    try {
      const { payload } = await prfsApi2("get_prfs_tree_leaf_indices", {
        set_id,
        leaf_vals: [walletAddr],
      });

      let pos_w = null;
      for (const node of payload.prfs_tree_nodes) {
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

      const siblingNodesData = await prfsApi2("get_prfs_tree_nodes_by_pos", {
        set_id,
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
    } catch (err) {
      console.error(err);
    }
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
        <div className={styles.leftBtnGroup}>
          <button onClick={handleCreateMerkleProof}>{i18n.create_merkle_path_label}</button>
          <span> {prfsSet?.set_id}</span>
        </div>
        <div className={styles.rightBtnGroup}>
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
    console.log(55);

    await sendMsgToParent(new Msg("OPEN_DIALOG", "p[ower]"));
  }, [value, setFormValues]);

  React.useEffect(() => {
    async function fn() {
      if (circuitInput.ref_type === "PRFS_SET") {
        if (!circuitInput.ref_value) {
          console.error("Prfs set ref value is not provided");
          return;
        }

        const { payload } = await prfsApi2("get_prfs_set_by_set_id", {
          set_id: circuitInput.ref_value,
        });

        setPrfsSet(payload.prfs_set);
      } else {
        console.error("Prfs set not found");
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

  const displayValue = React.useMemo(() => {
    if (value) {
      const { root, pathIndices, siblings } = value;
      const rt = `Root: ${root.toString().substring(0, 6)}..`;
      const paths = `Paths[${pathIndices.length}]: ${pathIndices.slice(0, 6).join(",")}..`;
      const sibs = `Siblings[${siblings.length}]`;
      return `${rt} / ${paths} / ${sibs}`;
    }

    return "";
  }, [value]);

  return (
    prfsSet && (
      <div className={styles.wrapper}>
        <input placeholder={`${i18n.set} - ${prfsSet.label}`} value={displayValue} readOnly />
        <div className={styles.btnGroup}>
          <button onClick={handleClickCreate}>{i18n.create}</button>
          {/* <Popover createBase={createBase} createPopover={createPopover} /> */}
        </div>
      </div>
    )
  );
};

export default MerkleProofInput;

export interface MerkleProofInputProps {
  walletAddr: string;
  circuitInput: CircuitInput;
  value: SpartanMerkleProof | undefined;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export interface MerkleProofModalProps {
  prfsSet: PrfsSet | undefined;
  walletAddr: string;
  circuitInput: CircuitInput;
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}
