import React from "react";
import cn from "classnames";
import { bytesLeToBigInt, poseidon_2_bigint_le, toUtf8Bytes } from "@taigalabs/prfs-crypto-js";
import { stringToBigInt } from "@taigalabs/prfs-crypto-js";
import { SimpleHashV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/SimpleHashV1Inputs";
import { SimpleHashV1Data } from "@taigalabs/prfs-circuit-interface/bindings/SimpleHashV1Data";
import { HashData } from "@taigalabs/prfs-circuit-interface/bindings/HashData";
import { Wallet } from "@taigalabs/prfs-crypto-deps-js/ethers";
import { PrfsIdCredential, QueryPresetVals, deriveProofKey } from "@taigalabs/prfs-id-sdk-web";

import styles from "./SimpleHashInput.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  FormError,
  FormInput,
  FormInputBtnRow,
  FormInputTitle,
  FormInputTitleRow,
  InputWrapper,
} from "@/components/form_input/FormInput";
import { FormErrors, FormHandler, FormValues } from "@/components/circuit_input_items/formTypes";
import { useSimpleHashFormHandler } from "./use_simple_hash_form_handler";
import { useClickHash } from "./use_click_hash";

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
        <FormInputBtnRow>
          <button className={styles.hashBtn} onClick={handleClickHash} type="button">
            {i18n.hash}
          </button>
        </FormInputBtnRow>
      </FormInputTitleRow>
      <InputWrapper>
        <div className={styles.interactiveArea}>
          <input placeholder={i18n.message_to_hash} value={msgRaw} onChange={handleChangeRaw} />
        </div>
      </InputWrapper>
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
