import React from "react";
import cn from "classnames";
import { bytesLeToBigInt, poseidon_2_bigint } from "@taigalabs/prfs-crypto-js";
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
import { Transmuted } from "../formErrorTypes";

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

  React.useEffect(() => {
    if (value === undefined) {
      const defaultHashData: Transmuted<HashData> = {
        msgRaw: null,
        msgRawInt: null,
        msgHash: null,
      };

      setFormValues(oldVals => {
        return {
          ...oldVals,
          hashData: defaultHashData,
        };
      });
    }
  }, [value, setFormValues, isPresetAssigned, setIsPresetAssigned]);

  const handleChangeRaw = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      if (error?.hashData && error.hashData.length > 0) {
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
    if (value?.hashData.msgRaw) {
      const msgRaw = value.hashData.msgRaw;
      const msgRawInt = stringToBigInt(msgRaw);
      const bytes = await poseidon_2_bigint([msgRawInt, BigInt(0)]);
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
      setFormErrors(oldVals => {
        const newVals = { ...oldVals, hashData: "Type some value to hash" };
        return newVals;
      });
    }
  }, [value, setFormValues]);

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
          <input
            placeholder={circuitTypeData.desc}
            value={value?.hashData.msgRaw?.toString() || ""}
            onChange={handleChangeRaw}
          />
        </div>
      </InputWrapper>
      {value?.hashData.msgHash ? <ComputedValue value={value.hashData} /> : null}
      {error?.hashData && <FormError>{error.hashData}</FormError>}
    </FormInput>
  );
};

export default SimpleHashInput;

export interface SimpleHashInputProps {
  // circuitTypeData: SimpleHashV1Data;
  // value: HashData | undefined;
  // error: string | undefined;
  // setFormValues: React.Dispatch<React.SetStateAction<SimpleHashV1Inputs>>;
  // setFormErrors: React.Dispatch<React.SetStateAction<Transmuted<SimpleHashV1Inputs>>>;
  // presetVals?: QueryPresetVals;

  circuitTypeData: SimpleHashV1Data;
  value: SimpleHashV1Inputs | undefined;
  error: Transmuted<SimpleHashV1Inputs> | undefined;
  setFormValues: React.Dispatch<React.SetStateAction<SimpleHashV1Inputs>>;
  setFormErrors: React.Dispatch<React.SetStateAction<Transmuted<SimpleHashV1Inputs>>>;
  presetVals?: QueryPresetVals;
  credential: PrfsIdCredential;
}

export interface ComputedValueProps {
  value: HashData | undefined;
}
