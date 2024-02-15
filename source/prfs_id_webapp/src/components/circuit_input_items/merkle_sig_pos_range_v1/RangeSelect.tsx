import React from "react";
import { MerkleSigPosRangeV1Data } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Data";

import styles from "./RangeSelect.module.scss";
import { InputWrapper } from "@/components/form_input/FormInput";
import { useI18N } from "@/i18n/context";

const noop = () => {};

const RangeSelect: React.FC<RangeSelectProps> = ({ circuitTypeData }) => {
  const i18n = useI18N();

  const elems = React.useMemo(() => {
    if (circuitTypeData?.range_data?.options) {
      for (const option of circuitTypeData.range_data.options) {
        const { label, lower_bound, upper_bound } = option;

        <option
        // value={{
        //   lower_bound,
        //   upper_bound,
        // }}
        >
          {label}
        </option>;
      }
    }
    const ret = [];

    return null;
  }, [circuitTypeData]);

  console.log(123, circuitTypeData);

  return (
    circuitTypeData.range_data && (
      <div>
        <p>
          {circuitTypeData.range_data.label} ({i18n.automatic})
        </p>
        <InputWrapper>
          <select value={1} onChange={noop}>
            <option value={0} disabled>
              0 - 1
            </option>
            <option value={1} disabled>
              1 - 1k
            </option>
            <option value={1000}>1k - 10k</option>
            <option value={10000}>10k - 100k</option>
            <option value={100000}>100k - 1m</option>
            <option value={1000000}>1m - 10m</option>
            <option value={10000000}>10m - 100m</option>
            <option value={100000000}>100m - 1b</option>
          </select>
        </InputWrapper>
      </div>
    )
  );
};

export default RangeSelect;

export interface RangeSelectProps {
  circuitTypeData: MerkleSigPosRangeV1Data;
}
