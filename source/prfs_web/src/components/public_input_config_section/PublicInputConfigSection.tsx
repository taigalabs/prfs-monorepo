import React from "react";
import Link from "next/link";

import styles from "./PublicInputConfigSection.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { WidgetHeader, WidgetLabel, WidgetPaddedBody } from "@/components/widget/Widget";
import CardRow from "@/components/card_row/CardRow";
import Card from "@/components/card/Card";
import SetDropdown from "@/components/set_dropdown/SetDropdown";
import { PublicInputType, PrfsSet, PublicInputInstance, PublicInput } from "@/models";
import { DropdownSingleSelectedValue } from "@/components/dropdown/Dropdown";

const PublicInputConfigSection: React.FC<PublicInputConfigSectionProps> = ({
  publicInputs,
  setPublicInputInstance,
}) => {
  const i18n = React.useContext(i18nContext);

  let vals = {};
  let setVals = {};
  publicInputs.forEach((pi, idx) => {
    switch (pi.type) {
      case PublicInputType.PROVER_GENERATED:
        break;
      case PublicInputType.PRFS_SET:
        const [selectedSet, setSelectedSet] =
          React.useState<DropdownSingleSelectedValue<PrfsSet>>(undefined);

        const handleSelectSet = React.useCallback(
          (val: PrfsSet) => {
            // console.log(13, val);
            setSelectedSet(val);
            setPublicInputInstance((oldVal: PublicInputInstance) => {
              const newVal = { ...oldVal };
              newVal[idx] = {
                label: pi.label,
                type: pi.type,
                value: val.merkle_root,
                ref: val.set_id,
              };
              return newVal;
            });
          },
          [setSelectedSet, setPublicInputInstance]
        );

        vals[idx] = selectedSet;
        setVals[idx] = handleSelectSet;

        break;
      default:
        throw new Error(`Invalid public input kind, ${pi.type}`);
    }
  });

  const publicInputEntries = React.useMemo(() => {
    let elems = [];

    for (const [idx, [_, pi]] of Object.entries(publicInputs).entries()) {
      let inputValue: React.ReactElement;
      switch (pi.type) {
        case PublicInputType.PROVER_GENERATED:
          inputValue = (
            <div className={styles.computedInput}>{PublicInputType.PROVER_GENERATED}</div>
          );
          break;
        case PublicInputType.PRFS_SET:
          inputValue = (
            <div>
              <div className={styles.publicInputType}>{PublicInputType.PRFS_SET}</div>
              <SetDropdown selectedVal={vals[idx]} handleSelectVal={setVals[idx]} />
            </div>
          );
          break;
        default:
          throw new Error("Invalid public input kind");
      }

      elems.push(
        <div className={styles.publicInputEntry} key={idx}>
          <div className={styles.inputIdx}>{idx}</div>
          <div className={styles.inputGroup}>
            <div className={styles.inputLabel}>{pi.label}</div>
            <div className={styles.inputDesc}>{pi.desc}</div>
            <div className={styles.inputContainer}>{inputValue}</div>
          </div>
        </div>
      );
    }

    return elems;
  }, [publicInputs, setVals]);

  return (
    <CardRow>
      <Card>
        <Widget>
          <WidgetHeader>
            <WidgetLabel>{i18n.configure_public_inputs}</WidgetLabel>
          </WidgetHeader>
          <WidgetPaddedBody>
            <div>{publicInputEntries}</div>
          </WidgetPaddedBody>
        </Widget>
      </Card>
    </CardRow>
  );
};

export default PublicInputConfigSection;

interface PublicInputConfigSectionProps {
  // circuit: PrfsCircuit;
  publicInputs: PublicInput[];
  setPublicInputInstance: React.Dispatch<React.SetStateAction<PublicInputInstance>>;
}
