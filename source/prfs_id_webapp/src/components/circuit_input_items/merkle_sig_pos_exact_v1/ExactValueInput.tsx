import React from "react";
import { MerkleSigPosExactV1Data } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosExactV1Data";
import Input from "@taigalabs/prfs-react-lib/src/input/Input";

import styles from "./ExactValueInput.module.scss";
import { useI18N } from "@/i18n/context";

const ExactValueInput: React.FC<ExactValueInputProps> = ({ circuitTypeData, exactValue }) => {
  const i18n = useI18N();

  return (
    <div className={styles.wrapper}>
      <Input
        className={styles.input}
        name={""}
        label={i18n.value}
        value={exactValue.raw}
        disabled
        readOnly
      />
    </div>
  );
};

export default ExactValueInput;

export interface ExactValueInputProps {
  circuitTypeData: MerkleSigPosExactV1Data;
  exactValue: {
    int: bigint;
    raw: string;
  };
}

export interface ExactValueType {
  int: bigint;
  raw: string;
}
