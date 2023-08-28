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

import styles from "./CreateSetForm.module.scss";
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
import { ContentAreaRow } from "@/components/content_area/ContentArea";

const CreateSetForm: React.FC<CreateSetFormProps> = () => {
  const i18n = React.useContext(i18nContext);
  const { state } = React.useContext(stateContext);
  const { localPrfsAccount } = state;
  const router = useRouter();

  const [label, setLabel] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [errMsg, setErrMsg] = React.useState("");

  const handleChangeLabel = React.useCallback(
    (ev: any) => {
      setLabel(ev.target.value);
    },
    [setLabel]
  );

  const handleChangeDesc = React.useCallback(
    (ev: any) => {
      setDesc(ev.target.value);
    },
    [setDesc]
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

    if (label.length < 1) {
      setErrMsg("Label should be defined");
      return;
    }

    if (desc.length < 1) {
      setErrMsg("Description should be given");
      return;
    }

    setErrMsg("");

    let proof_type_id = uuidv4();

    let createPrfsSetRequest = {
      proof_type_id,
      label,
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
      await prfsApi.createPrfsSet(createPrfsSetRequest);
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
          <Link href={paths.proof__dynamic_sets}>
            <ArrowButton variant="left" />
          </Link>
          <WidgetLabel>{i18n.create_dynamic_set}</WidgetLabel>
        </div>
      </TopWidgetTitle>

      <ContentAreaRow>
        <Widget>
          <WidgetPaddedBody>
            <div className={styles.desc}>{i18n.create_dynamic_set_subtitle}</div>
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

export default CreateSetForm;

export interface CreateSetFormProps {}
