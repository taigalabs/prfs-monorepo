import React from "react";
import cn from "classnames";
import { iterateJSON } from "@taigalabs/prfs-ts-utils";

import styles from "./CircuitTypeData.module.scss";
import { useI18N } from "@/i18n/use_i18n";

const CircuitTypeData: React.FC<CircuitTypeDataProps> = ({ circuitTypeData }) => {
  const i18n = useI18N();
  const elems = React.useMemo(() => {
    const jsonElems = iterateJSON(circuitTypeData);

    const elems = [];
    for (const [idx, jsonElem] of jsonElems.entries()) {
      elems.push(
        <li key={idx} className={styles.row} style={{ paddingLeft: 12 * jsonElem.depth }}>
          {jsonElem.type === "array" ? (
            <div
              className={cn(styles.emptyRow, { [styles.noPaddingTop]: jsonElem.label === "0" })}
            />
          ) : (
            <p className={styles.label}>{jsonElem.label}</p>
          )}
          <p className={styles.value}>{jsonElem.value}</p>
        </li>,
      );
    }

    return elems;
  }, [circuitTypeData]);

  return <ul className={styles.wrapper}>{elems}</ul>;
};

export default CircuitTypeData;

export interface CircuitTypeDataProps {
  circuitTypeData: Record<string, any>;
}
