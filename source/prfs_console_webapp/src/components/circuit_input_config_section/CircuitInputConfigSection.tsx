import React from "react";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import { CircuitInputMeta } from "@taigalabs/prfs-entities/bindings/CircuitInputMeta";
import { DropdownSingleSelectedValue } from "@taigalabs/prfs-react-lib/src/dropdown/Dropdown";

import styles from "./CircuitInputConfigSection.module.scss";
import { i18nContext } from "@/i18n/context";
import Widget, { WidgetHeader, WidgetLabel, WidgetPaddedBody } from "@/components/widget/Widget";
import SetDropdown from "@/components/set_dropdown/SetDropdown";

const CircuitInputConfigSection: React.FC<CircuitInputConfigSectionProps> = ({
  circuitInputsMeta,
  setCircuitInputs,
}) => {
  const i18n = React.useContext(i18nContext);

  const vals: Record<string, any> = {};
  const setVals: Record<string, any> = {};

  circuitInputsMeta.forEach((input, idx) => {
    if (input.ref_type === "PRFS_SET") {
      const [selectedSet, setSelectedSet] = React.useState<
        DropdownSingleSelectedValue<PrfsSet> | undefined
      >();

      const handleSelectSet = React.useCallback(
        (val: PrfsSet) => {
          setSelectedSet(val);
          setCircuitInputs((oldVal: CircuitInput[]) => {
            const newVal = [...oldVal];
            newVal[idx] = {
              name: input.name,
              label: input.label,
              type: input.type as any,
              desc: input.desc,
              element_type: null,
              value: "",
              units: 1,
              ref_type: input.ref_type,
              ref_value: val.set_id,
            };
            return newVal;
          });
        },
        [setSelectedSet, setCircuitInputs],
      );

      vals[idx] = selectedSet;
      setVals[idx] = handleSelectSet;
    }
  });

  const circuitInputEntries = React.useMemo(() => {
    let elems = [];

    for (const [idx, [_, input]] of Object.entries(circuitInputsMeta).entries()) {
      let inputValue: React.ReactElement;
      switch (input.ref_type) {
        case "PRFS_SET":
          inputValue = (
            <div>
              <div className={styles.publicInputType}>PRFS_SET</div>
              <SetDropdown selectedVal={vals[idx]} handleSelectVal={setVals[idx]} />
            </div>
          );
          break;
        default:
          inputValue = <div className={styles.computedInput}>{input.type}</div>;
      }

      elems.push(
        <div className={styles.circuitInputEntry} key={idx}>
          <div className={styles.inputIdx}>{idx}</div>
          <div className={styles.inputGroup}>
            <div className={styles.inputLabel}>{input.label}</div>
            <div className={styles.inputDesc}>{input.desc}</div>
            <div className={styles.inputContainer}>{inputValue}</div>
          </div>
        </div>,
      );
    }

    return elems;
  }, [circuitInputsMeta, setVals]);

  return (
    <Widget>
      <WidgetHeader>
        <WidgetLabel>{i18n.configure_circuit_inputs}</WidgetLabel>
      </WidgetHeader>
      <WidgetPaddedBody>
        <div>{circuitInputEntries}</div>
      </WidgetPaddedBody>
    </Widget>
  );
};

export default CircuitInputConfigSection;

interface CircuitInputConfigSectionProps {
  circuitInputsMeta: CircuitInputMeta[];
  setCircuitInputs: React.Dispatch<React.SetStateAction<CircuitInput[]>>;
}
