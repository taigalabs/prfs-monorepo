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
