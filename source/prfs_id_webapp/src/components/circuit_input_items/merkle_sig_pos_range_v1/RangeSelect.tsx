import React from "react";
import { MerkleSigPosRangeV1Data } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Data";
import Select from "@taigalabs/prfs-react-lib/src/select/Select";

import styles from "./RangeSelect.module.scss";
import { InputWrapper } from "@/components/form_input/FormInput";
import { useI18N } from "@/i18n/context";

const RangeSelect: React.FC<RangeSelectProps> = ({ circuitTypeData, rangeOptionIdx }) => {
  const i18n = useI18N();

  const optionElems = React.useMemo(() => {
    if (circuitTypeData?.range_data?.options) {
      const ret = [];
      for (const [idx, option] of circuitTypeData.range_data.options.entries()) {
        const { label } = option;
        const label_ = rangeOptionIdx === idx ? `${label} (${i18n.selected})` : label;

        ret.push(
          <option key={idx} value={idx} disabled>
            {label_}
          </option>,
        );
      }

      return ret;
    }

    return null;
  }, [circuitTypeData, rangeOptionIdx]);

  return (
    circuitTypeData.range_data && (
      <div className={styles.wrapper}>
        <Select name="" value={rangeOptionIdx} label={circuitTypeData.range_data.label}>
          {optionElems}
        </Select>
      </div>
    )
  );
};

export default RangeSelect;

export interface RangeSelectProps {
  circuitTypeData: MerkleSigPosRangeV1Data;
  rangeOptionIdx: number;
}
