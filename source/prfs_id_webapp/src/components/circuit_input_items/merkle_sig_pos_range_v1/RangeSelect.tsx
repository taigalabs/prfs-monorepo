import React from "react";
import { MerkleSigPosRangeV1Data } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Data";

import styles from "./RangeSelect.module.scss";
import { InputWrapper } from "@/components/form_input/FormInput";
import { useI18N } from "@/i18n/context";

const noop = () => {};

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
        <p className={styles.selectLabel}>
          {circuitTypeData.range_data.label} ({i18n.automatic})
        </p>
        <InputWrapper>
          <select className={styles.select} value={Math.max(rangeOptionIdx, 0)} onChange={noop}>
            {optionElems}
          </select>
        </InputWrapper>
      </div>
    )
  );
};

export default RangeSelect;

export interface RangeSelectProps {
  circuitTypeData: MerkleSigPosRangeV1Data;
  rangeOptionIdx: number;
}
