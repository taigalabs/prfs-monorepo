import React from "react";
import Link from "next/link";

import styles from "./CreateProofTypeForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { WidgetHeader, WidgetLabel, WidgetPaddedBody } from "@/components/widget/Widget";
import CardRow from "@/components/card_row/CardRow";
import Card from "@/components/card/Card";
import Breadcrumb, { BreadcrumbEntry } from "@/components/breadcrumb/Breadcrumb";
import { FormTitleRow, FormTitle, FormSubtitle } from "@/components/form/Form";
import CircuitTable from "@/components/circuit_table/CircuitTable";
import Button from "@/components/button/Button";
import { TableSelectedValue } from "../table/Table";
import FormTextInput from "@/components/form/FormTextInput";
import FormSelectedItems, { FormSelectedItemsEntry } from "../form/FormSelectedItems";
import SetDropdown from "../set_dropdown/SetDropdown";
import { RecordOfKeys } from "@/models/types";
import { PrfsCircuit, PrfsCircuitKeys, PrfsSetKeys, PublicInputKind } from "@/models";
import CircuitDropdown from "../circuit_dropdown/CircuitDropdown";
import { DropdownSingleSelectedValue } from "../dropdown/Dropdown";

const PublicInputSection: React.FC<PublicInputSectionProps> = ({ circuit }) => {
  const i18n = React.useContext(i18nContext);

  const [selectedSet, setSelectedSet] = React.useState<TableSelectedValue<PrfsSetKeys>>({});
  // const handleSelectSet = React.useCallback(
  //   (val: RecordOfKeys<PrfsSetKeys>) => {
  //     // console.log(11, val);

  //     setSelectedSet(oldVal => {
  //       if (oldVal[val.set_id]) {
  //         const newVal = { ...oldVal };
  //         delete newVal[val.set_id];
  //         return newVal;
  //       } else {
  //         return {
  //           ...oldVal,
  //           [val.set_id]: val,
  //         };
  //       }
  //     });
  //   },
  //   [setSelectedSet]
  // );

  // const selectedSetElem = React.useMemo(() => {
  //   let elems = [];
  //   for (let [_, set] of Object.entries(selectedSet)) {
  //     elems.push(
  //       <FormSelectedItemsEntry key={set.set_id}>
  //         <div>{set.set_id}</div>
  //         <div>X</div>
  //       </FormSelectedItemsEntry>
  //     );
  //   }

  //   return elems;
  // }, [selectedSet]);

  const publicInputEntries = React.useMemo(() => {
    let elems = [];
    for (const pi of circuit.public_inputs) {
      let inputValue;
      switch (pi.kind) {
        case PublicInputKind.COMPUTED:
          inputValue = <div>{i18n.computed.toUpperCase()}</div>;
          break;
        case PublicInputKind.SET:
          inputValue = (
            <div>
              <SetDropdown />
            </div>
          );
          break;
        default:
          throw new Error("Invalid public input kind");
      }

      elems.push(
        <div className={styles.publicInputEntry} key={pi.label}>
          <div>{pi.label}</div>
          {inputValue}
        </div>
      );
    }

    return elems;
  }, [circuit]);

  return (
    <CardRow>
      <Card>
        <Widget>
          <WidgetHeader>
            <WidgetLabel>{i18n.configure_public_inputs}</WidgetLabel>
          </WidgetHeader>
          <WidgetPaddedBody>
            <div>{publicInputEntries}</div>
            {/* <div className={styles.dropdownContainer}> */}
            {/*   <SetDropdown selectedVal={selectedSet} handleSelectVal={handleSelectSet} /> */}
            {/* </div> */}
          </WidgetPaddedBody>
          {/* <WidgetPaddedBody> */}
          {/*   <div> */}
          {/*     <div>{selectedSetElem}</div> */}
          {/*   </div> */}
          {/* </WidgetPaddedBody> */}
        </Widget>
      </Card>
    </CardRow>
  );
};

const CreateProofTypeForm: React.FC<CreateProofTypeFormProps> = () => {
  const i18n = React.useContext(i18nContext);

  const [selectedCircuit, setSelectedCircuit] =
    React.useState<DropdownSingleSelectedValue<PrfsCircuitKeys>>(undefined);

  const handleSelectCircuit = React.useCallback(
    (val: RecordOfKeys<PrfsCircuitKeys>) => {
      console.log(11, val);

      setSelectedCircuit(val);
    },
    [setSelectedCircuit]
  );

  return (
    <div className={styles.wrapper}>
      <Breadcrumb>
        <BreadcrumbEntry>
          <Link href="/proof_types">{i18n.proof_types}</Link>
        </BreadcrumbEntry>
        <BreadcrumbEntry>{i18n.create_proof_type}</BreadcrumbEntry>
      </Breadcrumb>
      <FormTitleRow>
        <FormTitle>{i18n.create_proof_type}</FormTitle>
        <FormSubtitle>{i18n.create_proof_type_subtitle}</FormSubtitle>
      </FormTitleRow>

      <CardRow>
        <Card>
          <Widget>
            <WidgetHeader>
              <WidgetLabel>{i18n.name_and_description}</WidgetLabel>
            </WidgetHeader>
            <WidgetPaddedBody>
              <div className={styles.proofName}>
                <FormTextInput label={i18n.name} />
              </div>
            </WidgetPaddedBody>
          </Widget>
        </Card>
      </CardRow>

      <CardRow>
        <Card>
          <Widget>
            <WidgetHeader>
              <WidgetLabel>{i18n.choose_circuit}</WidgetLabel>
            </WidgetHeader>
            <WidgetPaddedBody>
              <div className={styles.dropdownContainer}>
                <div>{i18n.circuit}</div>
                <CircuitDropdown
                  selectedVal={selectedCircuit}
                  handleSelectVal={handleSelectCircuit}
                />
              </div>
            </WidgetPaddedBody>
          </Widget>
        </Card>
      </CardRow>

      {selectedCircuit && <PublicInputSection circuit={selectedCircuit} />}

      <div className={styles.btnRow}>
        <Button variant="b">{i18n.create_proof_type}</Button>
      </div>
    </div>
  );
};

export default CreateProofTypeForm;

export interface CreateProofTypeFormProps {}

interface PublicInputSectionProps {
  circuit: PrfsCircuit;
}
