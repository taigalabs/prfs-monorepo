import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";
import { CircuitInputMeta } from "@taigalabs/prfs-entities/bindings/CircuitInputMeta";

import styles from "./CreateProofTypeForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, {
  TopWidgetTitle,
  WidgetHeader,
  WidgetLabel,
  WidgetPaddedBody,
} from "@/components/widget/Widget";
import CardRow from "@/components/card_row/CardRow";
import Card from "@/components/card/Card";
import FormTextInput from "@/components/form/FormTextInput";
import CircuitDropdown from "@/components/circuit_dropdown/CircuitDropdown";
import { stateContext } from "@/contexts/state";
import CircuitInputConfigSection from "@/components/circuit_input_config_section/CircuitInputConfigSection";
import { paths } from "@/paths";
import FormTextareaInput from "@/components/form/FormTextareaInput";

const CreateProofTypeForm: React.FC<CreateProofTypeFormProps> = () => {
  const i18n = React.useContext(i18nContext);
  const { state } = React.useContext(stateContext);
  const { localPrfsAccount } = state;
  const router = useRouter();

  const [circuitInputs, setCircuitInputs] = React.useState<Record<number, CircuitInput>>({});
  const [formAlert, setFormAlert] = React.useState("");
  const [name, setName] = React.useState("");
  const [imgUrl, setImgUrl] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [expression, setExpression] = React.useState("");
  const [selectedCircuit, setSelectedCircuit] = React.useState<PrfsCircuit | undefined>();

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

  const handleChangeExpression = React.useCallback(
    (ev: any) => {
      setExpression(ev.target.value);
    },
    [setExpression]
  );

  const handleChangeDesc = React.useCallback(
    (ev: any) => {
      setDesc(ev.target.value);
    },
    [setDesc]
  );

  const handleChangeImgUrl = React.useCallback(
    (ev: any) => {
      setImgUrl(ev.target.value);
    },
    [setImgUrl]
  );

  const handleClickCreateProofType = React.useCallback(() => {
    if (!localPrfsAccount) {
      setFormAlert("User is not signed in");
      return;
    }

    const { prfsAccount } = localPrfsAccount;

    if (!prfsAccount) {
      setFormAlert("Invalid local prfs account");
      return null;
    }

    if (name === undefined || name.length < 1) {
      setFormAlert("Name should be defined");
      return;
    }

    if (selectedCircuit === undefined) {
      setFormAlert("Circuit should be selected");
      return;
    }

    if (desc === undefined || desc.length < 1) {
      setFormAlert("Description should be given");
      return;
    }

    if (expression === undefined || expression.length < 1) {
      setFormAlert("Expression should be given");
      return;
    }

    const newCircuitInputs: Record<number, CircuitInput> = {};
    const circuit_inputs_meta = selectedCircuit.circuit_inputs_meta as CircuitInputMeta[];

    for (const [idx, input] of circuit_inputs_meta.entries()) {
      switch (input.ref) {
        case "PRFS_SET":
          if (!circuitInputs[idx]) {
            setFormAlert(`public input is undefined, idx: ${idx}`);
            return;
          }

          newCircuitInputs[idx] = circuitInputs[idx];
          break;

        default:
          newCircuitInputs[idx] = {
            name: input.name,
            label: input.label,
            type: input.type,
            desc: input.desc,
            value: "",
            ref: null,
          };
      }
    }

    setFormAlert("");

    let proof_type_id = uuidv4();

    let createPrfsProofTypeRequest = {
      proof_type_id,
      label: name,
      desc,
      img_url: imgUrl,
      expression,
      author: prfsAccount.sig,
      circuit_id: selectedCircuit.circuit_id,
      circuit_inputs: newCircuitInputs,
      driver_id: selectedCircuit.driver_id,
      driver_properties: selectedCircuit.driver_properties,
    };

    prfsApi
      .createPrfsProofType(createPrfsProofTypeRequest)
      .then(_res => {
        router.push(paths.proof__proof_types);
      })
      .catch(err => {
        setFormAlert(err);
      });
  }, [circuitInputs, selectedCircuit, name, setFormAlert, desc, localPrfsAccount]);

  return (
    <div className={styles.wrapper}>
      <TopWidgetTitle>
        <div className={styles.header}>
          <Link href={paths.proof__proof_instances}>
            <ArrowButton variant="left" />
          </Link>
          <WidgetLabel>{i18n.create_proof_type}</WidgetLabel>
        </div>
      </TopWidgetTitle>

      <CardRow>
        <Card>
          <Widget>
            <WidgetPaddedBody>
              <div className={styles.desc}>{i18n.create_proof_type_subtitle}</div>
              <div className={styles.textInputContainer}>
                <FormTextInput label={i18n.name} handleChange={handleChangeName} />
              </div>
              <div className={styles.textInputContainer}>
                <FormTextareaInput
                  label={i18n.description}
                  handleChange={handleChangeDesc}
                  rows={4}
                />
              </div>
              <div className={styles.textInputContainer}>
                <FormTextInput label={i18n.expression} handleChange={handleChangeExpression} />
              </div>
              <div className={styles.textInputContainer}>
                <FormTextInput label={i18n.image_url} handleChange={handleChangeImgUrl} />
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
        <CircuitInputConfigSection
          circuitInputsMeta={selectedCircuit.circuit_inputs_meta as CircuitInputMeta[]}
          setCircuitInputs={setCircuitInputs}
        />
      )}

      {formAlert.length > 0 && <div className={styles.alert}>{formAlert}</div>}

      <WidgetPaddedBody>
        <Button variant="c" handleClick={handleClickCreateProofType}>
          {i18n.create_proof_type}
        </Button>
      </WidgetPaddedBody>
    </div>
  );
};

export default CreateProofTypeForm;

export interface CreateProofTypeFormProps {}
