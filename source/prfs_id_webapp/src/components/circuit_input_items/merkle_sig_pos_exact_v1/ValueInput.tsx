import React from "react";
import { MerkleSigPosExactV1Data } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosExactV1Data";

import styles from "./ValueInput.module.scss";
import { useI18N } from "@/i18n/context";

const ValueInput: React.FC<RangeSelectProps> = ({ circuitTypeData, value }) => {
  const i18n = useI18N();

  return (
    <div className={styles.wrapper}>
      {value}
      {/* <Select name="" value={rangeOptionIdx} label={circuitTypeData.range_data.label}> */}
      {/*   {optionElems} */}
      {/* </Select> */}
    </div>
  );
};

export default ValueInput;

export interface RangeSelectProps {
  circuitTypeData: MerkleSigPosExactV1Data;
  value: string | null;
}
