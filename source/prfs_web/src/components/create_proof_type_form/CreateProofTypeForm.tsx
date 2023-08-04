import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./CreateProofTypeForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { WidgetHeader, WidgetLabel, WidgetPaddedBody } from "@/components/widget/Widget";
import CardRow from "@/components/card_row/CardRow";
import Card from "@/components/card/Card";
import Breadcrumb, { BreadcrumbEntry } from "@/components/breadcrumb/Breadcrumb";
import { FormTitleRow, FormTitle, FormSubtitle } from "@/components/form/Form";
import Button from "@/components/button/Button";
import FormTextInput from "@/components/form/FormTextInput";
import PublicInputConfigSection from "@/components/public_input_config_section/PublicInputConfigSection";
import { PrfsCircuit, PublicInputType, PublicInputInstance } from "@/models";
import CircuitDropdown from "@/components/circuit_dropdown/CircuitDropdown";
import { stateContext } from "@/contexts/state";
import * as prfsBackend from "@/fetch/prfsBackend";
import { getYMD } from "@/functions/date";
import { keccakHash } from "@/functions/hash";

const CreateProofTypeForm: React.FC<CreateProofTypeFormProps> = () => {
  const i18n = React.useContext(i18nContext);
  const { state } = React.useContext(stateContext);
  const { prfsAccount } = state;
  const router = useRouter();

  const [publicInputInstance, setPublicInputInstance] = React.useState<PublicInputInstance>({});
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
    if (!prfsAccount) {
      setFormAlert("User is not signed in");
      return;
    }

    if (name === undefined || name.length < 1) {
      setFormAlert("Name should be defined");
      return;
    }

    if (selectedCircuit === undefined) {
      setFormAlert("Circuit should be selected");
      return;
    }

    const newPublicInputInstance: PublicInputInstance = {};
    for (const [idx, pi] of selectedCircuit.public_inputs.entries()) {
      switch (pi.type) {
        case PublicInputType.PROVER_GENERATED:
          newPublicInputInstance[idx] = {
            label: pi.label,
            type: pi.type,
            desc: pi.desc,
            value: "",
          };

          break;
        case PublicInputType.PRFS_SET:
          if (!publicInputInstance[idx]) {
            setFormAlert(`public input is undefined, idx: ${idx}`);
            return;
          }

          newPublicInputInstance[idx] = publicInputInstance[idx];
          break;
        default:
          throw new Error(`public input invalid, type: ${pi.type}`);
      }
    }

    setFormAlert("");

    let { y, m, d } = getYMD();
    let now = Date.now();
    let hash = keccakHash(
      `${selectedCircuit.circuit_id}_${selectedCircuit.driver.driver_id}_${now}`
    ).substring(2, 8);

    let proof_type_id = `${prfsAccount.id}_${y}${m}${d}_${hash}`;

    let createPrfsProofTypeRequest = {
      proof_type_id,
      label: name,
      desc,
      author: prfsAccount.sig,
      circuit_id: selectedCircuit.circuit_id,
      public_input_instance: newPublicInputInstance,
      driver_id: selectedCircuit.driver.driver_id,
      driver_properties: selectedCircuit.driver.properties,
    };

    prfsBackend
      .createPrfsProofType(createPrfsProofTypeRequest)
      .then(_res => {
        router.push("/proof_types");
      })
      .catch(err => {
        setFormAlert(err);
      });
  }, [publicInputInstance, selectedCircuit, name, setFormAlert, desc, state.prfsAccount]);

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
        <PublicInputConfigSection
          publicInputs={selectedCircuit.public_inputs}
          setPublicInputInstance={setPublicInputInstance}
        />
      )}

      {formAlert.length > 0 && <div className={styles.alert}>{formAlert}</div>}

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
