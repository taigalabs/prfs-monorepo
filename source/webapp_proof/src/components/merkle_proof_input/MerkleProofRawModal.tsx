import React, { SetStateAction } from "react";
import JSONbig from "json-bigint";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { makePathIndices, makeSiblingPath } from "@taigalabs/prfs-crypto-js";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import { SpartanMerkleProof } from "@taigalabs/prfs-driver-spartan-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import TextButton from "@taigalabs/prfs-react-components/src/text_button/TextButton";

import styles from "./MerkleProofRawModal.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { Msg, sendMsgToParent } from "@taigalabs/prfs-sdk-web";

const MerkleProofRawModal: React.FC<MerkleProofRawModalProps> = ({
  prfsSet,
  circuitInput,
  handleClickSubmit,
  setIsOpen,
}) => {
  const i18n = React.useContext(i18nContext);
  const [walletAddr, setWalletAddr] = React.useState("");
  const [value, setValue] = React.useState<SpartanMerkleProof>();
  const [merkleProofValue, setMerkleProofValue] = React.useState("");

  React.useEffect(() => {
    const v = JSONbig.stringify(value, undefined, 2);
    setMerkleProofValue(v);
  }, [value, setMerkleProofValue]);

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

      setValue(merkleProof);
    } catch (err) {
      console.error(err);
    }
  }, [circuitInput, walletAddr, prfsSet, setValue]);

  const handleClickConnectWallet = React.useCallback(async () => {
    const addr = await sendMsgToParent(new Msg("GET_ADDRESS", ""));

    setWalletAddr(addr);
  }, [setWalletAddr]);

  const handleClickCancel = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const extendedHandleClickSubmit = React.useCallback(() => {
    if (value) {
      handleClickSubmit(value);
    }
  }, [value, handleClickSubmit]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <p>{i18n.type_merkle_proof}</p>
      </div>
      <div className={styles.row}>
        <div>
          <span>
            {i18n.merkle_proof}
            {" - "}
          </span>
          <span> {prfsSet?.label}</span>
        </div>
        <textarea className={styles.merkleProofInput} value={merkleProofValue} readOnly />
      </div>
      {/* <div className={styles.row}> */}
      {/*   <fieldset className={styles.merkleWizard}> */}
      {/*     <legend> */}
      {/*       <p className={styles.guide}>{i18n.create_merkle_proof_guide}</p> */}
      {/*     </legend> */}
      {/*     <p>{i18n.wallet_address}</p> */}
      {/*     <div className={styles.addrInputBox}> */}
      {/*       <input */}
      {/*         className={styles.addrInput} */}
      {/*         value={walletAddr} */}
      {/*         readOnly */}
      {/*         placeholder={i18n.address_input_placeholder} */}
      {/*       /> */}
      {/*       <button className={styles.connectBtn} onClick={handleClickConnectWallet}> */}
      {/*         {i18n.connect} */}
      {/*       </button> */}
      {/*     </div> */}
      {/*     <div className={styles.createBtnContainer}> */}
      {/*       <TextButton variant="aqua_blue_1" handleClick={handleCreateMerkleProof}> */}
      {/*         {i18n.create_merkle_path_label} */}
      {/*       </TextButton> */}
      {/*     </div> */}
      {/*   </fieldset> */}
      {/* </div> */}
      <div className={styles.dialogBtnRow}>
        <Button variant="transparent_black_1" handleClick={extendedHandleClickSubmit}>
          {i18n.submit.toUpperCase()}
        </Button>
        <Button variant="transparent_black_1" handleClick={handleClickCancel}>
          {i18n.cancel.toUpperCase()}
        </Button>
      </div>
    </div>
  );
};

export default MerkleProofRawModal;

export interface MerkleProofRawModalProps {
  prfsSet: PrfsSet | undefined;
  circuitInput: CircuitInput;
  handleClickSubmit: (merkleProof: SpartanMerkleProof) => void;
  setIsOpen: (b: boolean) => void;
}
