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
import { PrfsSetType } from "@taigalabs/prfs-entities/bindings/PrfsSetType";

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

  const handleCreateSet = React.useCallback(async () => {
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

    let createPrfsSetRequest = {
      prfs_set_ins1: {
        set_id: uuidv4(),
        set_type: "Dynamic" as PrfsSetType,
        label,
        author: prfsAccount.sig,
        desc,
        hash_algorithm: "",
        cardinality: BigInt(0),
        merkle_root: "",
        element_type: "",
        finite_field: "",
        elliptic_curve: "",
      },
    };

    try {
      await prfsApi.createPrfsSet(createPrfsSetRequest);
      router.push(paths.proof__dynamic_sets);
    } catch (err: any) {
      console.error(err);

      setErrMsg(err.toString());
    }
  }, [label, setErrMsg, desc, localPrfsAccount]);

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
              <FormTextInput label={i18n.label} handleChange={handleChangeLabel} />
            </div>
            <div className={styles.textInputContainer}>
              <FormTextareaInput
                label={i18n.description}
                handleChange={handleChangeDesc}
                rows={4}
              />
            </div>
          </WidgetPaddedBody>
        </Widget>
      </ContentAreaRow>

      <WidgetPaddedBody>
        <div className={styles.errMsg} style={{ opacity: errMsg.length > 0 ? 1 : 0 }}>
          {errMsg}
        </div>

        <Button variant="aqua_blue_1" handleClick={handleCreateSet}>
          {i18n.create_dynamic_set}
        </Button>
      </WidgetPaddedBody>
    </div>
  );
};

export default CreateSetForm;

export interface CreateSetFormProps {}
