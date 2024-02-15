import React from "react";
import cn from "classnames";
import { bytesLeToBigInt, poseidon_2_bigint_le } from "@taigalabs/prfs-crypto-js";
import { stringToBigInt } from "@taigalabs/prfs-crypto-js";
import { SimpleHashV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/SimpleHashV1Inputs";
import { HashData } from "@taigalabs/prfs-circuit-interface/bindings/HashData";
import { PrfsIdCredential, QueryPresetVals } from "@taigalabs/prfs-id-sdk-web";

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
import { SimpleHashV1Data } from "@taigalabs/prfs-circuit-interface/bindings/SimpleHashV1Data";
import { FormErrors, FormValues } from "@/components/circuit_input_items/formErrorTypes";

const ComputedValue: React.FC<ComputedValueProps> = ({ value }) => {
  const val = React.useMemo(() => {
    if (value && value.msgHash && value.msgRawInt) {
      // const msgRawInt = "Msg: " + value.msgRawInt.toString().substring(0, 8) + "...";
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
  value,
  error,
  setFormErrors,
  setFormValues,
}) => {
  const i18n = React.useContext(i18nContext);
  const [isPresetAssigned, setIsPresetAssigned] = React.useState(false);

  // React.useEffect(() => {
  //   if (value === undefined) {
  //     const defaultHashData: FormErrors<SimpleHashV1Inputs> = {
  //       hashData: null,
  //     };

  //     setFormValues(oldVals => {
  //       return {
  //         ...oldVals,
  //         hashData: null,
  //         // hashData: defaultHashData,
  //       };
  //     });
  //   }
  // }, [value, setFormValues, isPresetAssigned, setIsPresetAssigned]);

  const handleChangeRaw = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      if (error?.hashData && error.hashData) {
        setFormErrors(oldVals => {
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

  const handleClickHash = React.useCallback(async () => {
    if (value.hashData?.msgRaw) {
      const msgRaw = value.hashData.msgRaw;
      const msgRawInt = stringToBigInt(msgRaw);
      const bytes = await poseidon_2_bigint_le([msgRawInt, BigInt(0)]);
      const msgHash = bytesLeToBigInt(bytes);

      setFormValues(oldVals => ({
        ...oldVals,
        hashData: {
          msgRaw,
          msgRawInt,
          msgHash,
        },
      }));
    } else {
      const hashDataError = <span>Type some input to get hash result</span>;

      setFormErrors(oldVals => ({
        ...oldVals,
        hashData: hashDataError,
      }));
    }
  }, [value, setFormValues]);

  const msgRaw = React.useMemo(() => {
    if (value?.hashData) {
      return value.hashData.msgRaw.toString();
    } else return "";
  }, [value?.hashData]);

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
  circuitTypeData: SimpleHashV1Data;
  value: FormValues<SimpleHashV1Inputs>;
  error: FormErrors<SimpleHashV1Inputs> | undefined;
  setFormValues: React.Dispatch<React.SetStateAction<SimpleHashV1Inputs>>;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors<SimpleHashV1Inputs>>>;
  presetVals?: QueryPresetVals;
  credential: PrfsIdCredential;
}

export interface ComputedValueProps {
  value: HashData | undefined;
}
