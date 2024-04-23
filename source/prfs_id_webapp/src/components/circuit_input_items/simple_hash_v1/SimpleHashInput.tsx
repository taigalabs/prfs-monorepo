import React from "react";
import cn from "classnames";
import { SimpleHashV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/SimpleHashV1Inputs";
import { SimpleHashV1Data } from "@taigalabs/prfs-circuit-interface/bindings/SimpleHashV1Data";
import { HashData } from "@taigalabs/prfs-circuit-interface/bindings/HashData";
import { PrfsIdCredential, QueryPresetVals } from "@taigalabs/prfs-id-sdk-web";
import {
  Fieldset,
  InputElement,
  InputWrapper,
  Label,
} from "@taigalabs/prfs-react-lib/src/input/InputComponent";
import { useInput } from "@taigalabs/prfs-react-lib/src/input/useInput";

import styles from "./SimpleHashInput.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  FormError,
  FormInput,
  FormInputTitle,
  FormInputTitleRow,
} from "@/components/form_input/FormInput";
import { FormErrors, FormHandler, FormValues } from "@/components/circuit_input_items/formTypes";
import { useSimpleHashFormHandler } from "./use_simple_hash_form_handler";
import { useClickHash } from "./use_click_hash";
import { FormInputButton } from "@/components/circuit_inputs/CircuitInputComponents";

const ComputedValue: React.FC<ComputedValueProps> = ({ value }) => {
  const val = React.useMemo(() => {
    if (value && value.msgHash && value.msgRawInt) {
      const msgHash = "Msg hash: " + value.msgHash.toString().substring(0, 20) + "...";

      return `${msgHash}`;
    } else {
      return null;
    }
  }, [value]);

  return <div className={styles.computedValue}>{val}</div>;
};

const SimpleHashInput: React.FC<SimpleHashInputProps> = ({
  circuitTypeData,
  credential,
  value,
  error,
  setFormErrors,
  setFormValues,
  setFormHandler,
  proofAction,
}) => {
  const i18n = React.useContext(i18nContext);
  const { isFocused, handleFocus, handleBlur } = useInput();

  const handleClickHash = useClickHash({
    value,
    setFormValues,
    setFormErrors,
  });

  const handleChangeRaw = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      if (error?.hashData && error.hashData) {
        setFormErrors((oldVals: any) => {
          const newVals = { ...oldVals };
          delete newVals.hashData;
          return newVals;
        });
      }

      const newVal = ev.target.value;

      setFormValues(oldVals => {
        const oldVal = oldVals.hashData || {};

        return {
          ...oldVals,
          hashData: {
            ...oldVal,
            msgRaw: newVal,
          },
        };
      });
    },
    [setFormValues, value, setFormErrors],
  );

  const msgRaw = React.useMemo(() => {
    if (value?.hashData) {
      return value.hashData.msgRaw.toString();
    } else return "";
  }, [value?.hashData]);

  useSimpleHashFormHandler({
    setFormHandler,
    setFormErrors,
    credential,
    proofAction,
  });

  return (
    <FormInput>
      <FormInputTitleRow>
        <FormInputTitle>{circuitTypeData.label}</FormInputTitle>
      </FormInputTitleRow>
      <div className={styles.hashDataInput}>
        <div className={styles.hashData}>
          <InputWrapper
            className={styles.inputWrapper}
            isError={!!error?.hashData}
            isFocused={isFocused}
            hasValue={msgRaw.length > 0}
            hasValueClassName={styles.hasValue}
            focusClassName={styles.focus}
          >
            <Label name={""} className={styles.label}>
              {i18n.data}
            </Label>
            <Fieldset>{i18n.data}</Fieldset>
            <InputElement
              name={""}
              value={msgRaw || ""}
              className={styles.input}
              onChange={handleChangeRaw}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </InputWrapper>
        </div>
        <div className={styles.btnRow}>
          <FormInputButton handleClick={handleClickHash} type="button">
            {i18n.hash}
          </FormInputButton>
        </div>
      </div>
      {value?.hashData && <ComputedValue value={value.hashData} />}
      {error?.hashData && <FormError>{error.hashData}</FormError>}
    </FormInput>
  );
};

export default SimpleHashInput;

export interface SimpleHashInputProps {
  proofAction: string;
  circuitTypeData: SimpleHashV1Data;
  value: FormValues<SimpleHashV1Inputs>;
  error: FormErrors<SimpleHashV1Inputs> | undefined;
  setFormValues: React.Dispatch<React.SetStateAction<SimpleHashV1Inputs>>;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors<SimpleHashV1Inputs>>>;
  setFormHandler: React.Dispatch<React.SetStateAction<FormHandler | null>>;
  presetVals?: QueryPresetVals;
  credential: PrfsIdCredential;
}

export interface ComputedValueProps {
  value: HashData | undefined;
}
