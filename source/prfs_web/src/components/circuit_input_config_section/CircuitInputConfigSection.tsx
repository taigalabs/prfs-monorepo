import React from "react";
import Link from "next/link";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import { CircuitInputMeta } from "@taigalabs/prfs-entities/bindings/CircuitInputMeta";
import { DropdownSingleSelectedValue } from "@taigalabs/prfs-react-components/src/dropdown/Dropdown";

import styles from "./CircuitInputConfigSection.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { WidgetHeader, WidgetLabel, WidgetPaddedBody } from "@/components/widget/Widget";
import CardRow from "@/components/card_row/CardRow";
import Card from "@/components/card/Card";
import SetDropdown from "@/components/set_dropdown/SetDropdown";

const CircuitInputConfigSection: React.FC<CircuitInputConfigSectionProps> = ({
  circuitInputsMeta,
  setCircuitInputs,
}) => {
  const i18n = React.useContext(i18nContext);

  const vals: Record<string, any> = {};
  const setVals: Record<string, any> = {};

  circuitInputsMeta.forEach((input, idx) => {
    if (input.ref === "PRFS_SET") {
      const [selectedSet, setSelectedSet] = React.useState<
        DropdownSingleSelectedValue<PrfsSet> | undefined
      >();

      const handleSelectSet = React.useCallback(
        (val: PrfsSet) => {
          setSelectedSet(val);
          setCircuitInputs((oldVal: Record<number, CircuitInput>) => {
            const newVal = { ...oldVal };
            newVal[idx] = {
              label: input.label,
              type: input.type,
              desc: input.desc,
              value: val.set_id,
              ref: input.ref,
            };
            return newVal;
          });
        },
        [setSelectedSet, setCircuitInputs]
      );

      vals[idx] = selectedSet;
      setVals[idx] = handleSelectSet;
    }
  });

  const circuitInputEntries = React.useMemo(() => {
    let elems = [];

    for (const [idx, [_, input]] of Object.entries(circuitInputsMeta).entries()) {
      let inputValue: React.ReactElement;
      switch (input.ref) {
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
        <div className={styles.publicInputEntry} key={idx}>
          <div className={styles.inputIdx}>{idx}</div>
          <div className={styles.inputGroup}>
            <div className={styles.inputLabel}>{input.label}</div>
            <div className={styles.inputDesc}>{input.desc}</div>
            <div className={styles.inputContainer}>{inputValue}</div>
          </div>
        </div>
      );
    }

    return elems;
  }, [circuitInputsMeta, setVals]);

  return (
    <CardRow>
      <Card>
        <Widget>
          <WidgetHeader>
            <WidgetLabel>{i18n.configure_circuit_inputs}</WidgetLabel>
          </WidgetHeader>
          <WidgetPaddedBody>
            <div>{circuitInputEntries}</div>
          </WidgetPaddedBody>
        </Widget>
      </Card>
    </CardRow>
  );
};

export default CircuitInputConfigSection;

interface CircuitInputConfigSectionProps {
  circuitInputsMeta: CircuitInputMeta[];
  setCircuitInputs: React.Dispatch<React.SetStateAction<Record<number, CircuitInput>>>;
}
