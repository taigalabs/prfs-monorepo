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
import {
  PrfsCircuit,
  PublicInput,
  PublicInputType,
  PrfsProofType,
  PrfsSet,
  PublicInputInstance,
} from "@/models";
import CircuitDropdown from "@/components/circuit_dropdown/CircuitDropdown";
import { DropdownSingleSelectedValue } from "@/components/dropdown/Dropdown";

const PublicInputSection: React.FC<PublicInputSectionProps> = ({ circuit, setPublicInputs }) => {
  const i18n = React.useContext(i18nContext);

  let vals = {};
  let setVals = {};
  circuit.public_inputs.forEach((pi, idx) => {
    switch (pi.type) {
      case PublicInputType.COMPUTED:
        break;
      case PublicInputType.PRFS_SET:
        const [selectedSet, setSelectedSet] =
          React.useState<DropdownSingleSelectedValue<PrfsSet>>(undefined);

        const handleSelectSet = React.useCallback(
          (val: PrfsSet) => {
            // console.log(13, val);
            setSelectedSet(val);
            setPublicInputs((oldVal: any) => {
              const newVal = { ...oldVal };
              newVal[idx] = val;
              return newVal;
            });
          },
          [setSelectedSet, setPublicInputs]
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

    for (const [idx, [_, pi]] of Object.entries(circuit.public_inputs).entries()) {
      let inputValue: React.ReactElement;
      switch (pi.type) {
        case PublicInputType.COMPUTED:
          inputValue = <div className={styles.computedInput}>{i18n.computed.toUpperCase()}</div>;
          break;
        case PublicInputType.PRFS_SET:
          inputValue = <SetDropdown selectedVal={vals[idx]} handleSelectVal={setVals[idx]} />;
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
  }, [circuit, setVals]);

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

  const [publicInputs, setPublicInputs] = React.useState<PublicInputInstance>({});
  const [formAlert, setFormAlert] = React.useState("");
  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [selectedCircuit, setSelectedCircuit] = React.useState<PrfsCircuit>(undefined);

  const handleSelectCircuit = React.useCallback(
    (val: PrfsCircuit) => {
      setSelectedCircuit(val);
    },
    [setSelectedCircuit]
  );

  const handleChangeName = React.useCallback(
    (ev: any) => {
      setName(ev.target.value);
    },
    [setName]
  );

  const handleChangeDesc = React.useCallback(
    (ev: any) => {
      setDesc(ev.target.value);
    },
    [setDesc]
  );

  const handleClickCreateProofType = React.useCallback(() => {
    console.log(11, publicInputs);

    if (name === undefined || name.length < 1) {
      setFormAlert("Name should be defined");
      return;
    }

    if (selectedCircuit === undefined) {
      setFormAlert("Circuit should be selected");
      return;
    }

    selectedCircuit.public_inputs.forEach((pi: PublicInput, idx: number) => {
      switch (pi.type) {
        case PublicInputType.COMPUTED:
          break;
        case PublicInputType.PRFS_SET:
          if (!publicInputs[idx]) {
            setFormAlert(`public input is undefined, idx: ${idx}`);
            return;
          }
          break;
        default:
      }
    });

    setFormAlert("");

    let prfsProofType = {
      label: name,
      author: "a",
      proof_type_id: "spo",
      circuit_id: selectedCircuit.circuit_id,
      program_id: selectedCircuit.program.program_id,
      public_inputs: publicInputs,
    };

    console.log(11, prfsProofType);

    // prfsBackend.putPrfsProofType();
  }, [publicInputs, selectedCircuit, name, setFormAlert]);

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
              <div className={styles.textInputContainer}>
                <FormTextInput label={i18n.name} handleChange={handleChangeName} />
              </div>
              <div className={styles.textInputContainer}>
                <FormTextInput label={i18n.description} handleChange={handleChangeDesc} />
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

      {selectedCircuit && (
        <PublicInputSection
          circuit={selectedCircuit}
          // publicInputs={publicInputs}
          setPublicInputs={setPublicInputs}
        />
      )}

      <div className={styles.alert}>{formAlert}</div>

      <div className={styles.btnRow}>
        <Button variant="b" handleClick={handleClickCreateProofType}>
          {i18n.create_proof_type}
        </Button>
      </div>
    </div>
  );
};

export default CreateProofTypeForm;

export interface CreateProofTypeFormProps {}

interface PublicInputSectionProps {
  circuit: PrfsCircuit;
  setPublicInputs: React.Dispatch<React.SetStateAction<PublicInputInstance>>;
}

// interface  {
//   [key: number]: any;
// }
