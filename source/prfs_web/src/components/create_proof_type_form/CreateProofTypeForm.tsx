import React from "react";
import Link from "next/link";

import styles from "./CreateProofTypeForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { WidgetHeader, WidgetLabel, WidgetPaddedBody } from "@/components/widget/Widget";
import CardRow from "@/components/card_row/CardRow";
import Card from "@/components/card/Card";
import Breadcrumb, { BreadcrumbEntry } from "@/components/breadcrumb/Breadcrumb";
import { FormTitleRow, FormTitle, FormSubtitle } from "@/components/form/Form";
import Button from "@/components/button/Button";
import FormTextInput from "@/components/form/FormTextInput";
import SetDropdown from "@/components/set_dropdown/SetDropdown";
import { RecordOfKeys } from "@/models/types";
import { PrfsCircuit, PrfsCircuitKeys, PrfsSetKeys, PublicInputKind } from "@/models";
import CircuitDropdown from "@/components/circuit_dropdown/CircuitDropdown";
import { DropdownSingleSelectedValue } from "@/components/dropdown/Dropdown";

const PublicInputSection: React.FC<PublicInputSectionProps> = ({ circuit }) => {
  const i18n = React.useContext(i18nContext);

  const [selectedSet, setSelectedSet] =
    React.useState<DropdownSingleSelectedValue<PrfsSetKeys>>(undefined);
  const handleSelectSet = React.useCallback(
    (val: RecordOfKeys<PrfsSetKeys>) => {
      console.log(13, val);
      setSelectedSet(val);
    },
    [setSelectedSet]
  );

  const publicInputEntries = React.useMemo(() => {
    let elems = [];
    for (const [idx, [_, pi]] of Object.entries(circuit.public_inputs).entries()) {
      let inputValue: React.ReactElement;
      switch (pi.kind) {
        case PublicInputKind.COMPUTED:
          inputValue = <div className={styles.computedInput}>{i18n.computed.toUpperCase()}</div>;
          break;
        case PublicInputKind.SET:
          inputValue = <SetDropdown selectedVal={selectedSet} handleSelectVal={handleSelectSet} />;
          break;
        default:
          throw new Error("Invalid public input kind");
      }

      elems.push(
        <div className={styles.publicInputEntry} key={idx}>
          <div className={styles.left}>{idx}</div>
          <div className={styles.right}>
            <div>{pi.label}</div>
            <div className={styles.inputContainer}>{inputValue}</div>
          </div>
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
          </WidgetPaddedBody>
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
      // console.log(11, val);
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
