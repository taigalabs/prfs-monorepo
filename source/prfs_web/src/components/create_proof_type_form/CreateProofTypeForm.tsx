import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
// import * as prfsApi from "@taigalabs/prfs-api-js";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";
import { CircuitInputMeta } from "@taigalabs/prfs-entities/bindings/CircuitInputMeta";
import { PrfsCircuitSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsCircuitSyn1";

import styles from "./CreateProofTypeForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, {
  TopWidgetTitle,
  WidgetHeader,
  WidgetLabel,
  WidgetPaddedBody,
} from "@/components/widget/Widget";
import FormTextInput from "@/components/form/FormTextInput";
import CircuitDropdown from "@/components/circuit_dropdown/CircuitDropdown";
import { stateContext } from "@/contexts/state";
import CircuitInputConfigSection from "@/components/circuit_input_config_section/CircuitInputConfigSection";
import { paths } from "@/paths";
import FormTextareaInput from "@/components/form/FormTextareaInput";
import { ContentAreaRow } from "../content_area/ContentArea";

const CreateProofTypeForm: React.FC<CreateProofTypeFormProps> = () => {
  const i18n = React.useContext(i18nContext);
  const { state } = React.useContext(stateContext);
  const { localPrfsAccount } = state;
  const router = useRouter();

  const [circuitInputs, setCircuitInputs] = React.useState<CircuitInput[]>([]);
  const [name, setName] = React.useState("");
  const [imgUrl, setImgUrl] = React.useState(null);
  const [imgCaption, setImgCaption] = React.useState(null);
  const [desc, setDesc] = React.useState("");
  const [expression, setExpression] = React.useState("");
  const [selectedCircuit, setSelectedCircuit] = React.useState<PrfsCircuitSyn1 | undefined>();
  const [errMsg, setErrMsg] = React.useState("");

  const handleSelectCircuit = React.useCallback(
    (val: PrfsCircuitSyn1) => {
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

  const handleChangeImgCaption = React.useCallback(
    (ev: any) => {
      setImgUrl(ev.target.value);
    },
    [setImgCaption]
  );

  const handleClickCreateProofType = React.useCallback(async () => {
    if (!localPrfsAccount) {
      setErrMsg("User is not signed in");
      return;
    }

    const { prfsAccount } = localPrfsAccount;

    if (!prfsAccount) {
      setErrMsg("Invalid local prfs account");
      return null;
    }

    if (name === undefined || name.length < 1) {
      setErrMsg("Name should be defined");
      return;
    }

    if (selectedCircuit === undefined) {
      setErrMsg("Circuit should be selected");
      return;
    }

    if (desc === undefined || desc.length < 1) {
      setErrMsg("Description should be given");
      return;
    }

    if (expression === undefined || expression.length < 1) {
      setErrMsg("Expression should be given");
      return;
    }

    const newCircuitInputs: CircuitInput[] = [];
    const circuit_inputs_meta = selectedCircuit.circuit_inputs_meta as CircuitInputMeta[];

    for (const [idx, input] of circuit_inputs_meta.entries()) {
      switch (input.ref) {
        case "PRFS_SET":
          if (!circuitInputs[idx]) {
            setErrMsg(`public input is undefined, idx: ${idx}`);
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

    setErrMsg("");

    let proof_type_id = uuidv4();

    let createPrfsProofTypeRequest = {
      proof_type_id,
      label: name,
      desc,
      img_url: imgUrl,
      img_caption: imgCaption,
      expression,
      author: prfsAccount.sig,
      circuit_id: selectedCircuit.circuit_id,
      circuit_type: selectedCircuit.circuit_type,
      circuit_inputs: newCircuitInputs,
      circuit_driver_id: selectedCircuit.circuit_driver_id,
      driver_properties: selectedCircuit.driver_properties,
    };

    try {
      // await prfsApi.createPrfsProofType(createPrfsProofTypeRequest);
      await prfsApi2("create_prfs_proof_type", createPrfsProofTypeRequest);

      router.push(paths.proof__proof_types);
    } catch (err: any) {
      console.error(err);

      setErrMsg(err.toString());
    }
  }, [circuitInputs, selectedCircuit, name, setErrMsg, desc, localPrfsAccount]);

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

      <ContentAreaRow>
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
            <div className={styles.textInputContainer}>
              <FormTextInput label={i18n.image_caption} handleChange={handleChangeImgCaption} />
            </div>
          </WidgetPaddedBody>
        </Widget>
      </ContentAreaRow>

      <ContentAreaRow>
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
      </ContentAreaRow>

      {selectedCircuit && (
        <ContentAreaRow>
          <CircuitInputConfigSection
            circuitInputsMeta={selectedCircuit.circuit_inputs_meta as CircuitInputMeta[]}
            setCircuitInputs={setCircuitInputs}
          />
        </ContentAreaRow>
      )}

      <WidgetPaddedBody>
        <div className={styles.errMsg} style={{ opacity: errMsg.length > 0 ? 1 : 0 }}>
          {errMsg}
        </div>

        <Button variant="aqua_blue_1" handleClick={handleClickCreateProofType}>
          {i18n.create_proof_type}
        </Button>
      </WidgetPaddedBody>
    </div>
  );
};

export default CreateProofTypeForm;

export interface CreateProofTypeFormProps {}
