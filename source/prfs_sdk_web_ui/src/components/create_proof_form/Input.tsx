import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { CircuitDriver, LogEventType } from "@taigalabs/prfs-driver-interface";
import { Msg, MsgType, sendMsgToParent } from "@taigalabs/prfs-sdk-web";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";

import styles from "./CreateProofForm.module.scss";
import { initDriver, interpolateSystemAssetEndpoint } from "@/functions/circuitDriver";
import { i18nContext } from "@/contexts/i18n";
import { delay } from "@/functions/interval";
import MerkleProofInput from "@/components/merkle_proof_input/MerkleProofInput";
import SigDataInput from "@/components/sig_data_input/SigDataInput";
import { createProof } from "@/functions/proof";
import CreateProofProgress from "@/components/create_proof_progress/CreateProofProgress";
import { envs } from "@/envs";
import Passcode from "../passcode/Passcode";

const Input: React.FC<InputProps> = ({ children, label }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.circuitInputEntry}>
      <div className={styles.entryMeta}>
        <div className={styles.entryLabel}>{label}</div>
      </div>
      <div className={styles.inputContainer}>{children}</div>
    </div>
  );
};

export default Input;

export interface InputProps {
  label: string;
  children: React.ReactNode;
}
