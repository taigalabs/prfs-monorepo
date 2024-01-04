import React from "react";
import cn from "classnames";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { bytesLeToBigInt, poseidon_2_bigint } from "@taigalabs/prfs-crypto-js";
import { stringToBigInt } from "@taigalabs/prfs-crypto-js";

import styles from "./HashInput.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  FormError,
  FormInput,
  FormInputBtnRow,
  FormInputTitle,
  FormInputTitleRow,
  InputWrapper,
} from "@/components/form_input/FormInput";

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

const HashInput: React.FC<HashInputProps> = ({
  circuitInput,
  value,
  error,
  setFormErrors,
  setFormValues,
}) => {
  const i18n = React.useContext(i18nContext);

  React.useEffect(() => {
    if (value === undefined) {
      const defaultHashData: HashData = {
        msgRaw: null,
        msgRawInt: null,
        msgHash: null,
      };

      setFormValues(oldVals => {
        return {
          ...oldVals,
          [circuitInput.name]: defaultHashData,
        };
      });
    }
  }, [value, setFormValues]);

  const handleChangeRaw = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      if (error && error.length > 0) {
        setFormErrors(oldVals => {
          const newVals = { ...oldVals };
          delete newVals[circuitInput.name];
          return newVals;
        });
      }

      const newVal = ev.target.value;

      setFormValues(oldVals => {
        const oldVal = oldVals[circuitInput.name] || {};

        return {
          ...oldVals,
          [circuitInput.name]: {
            ...oldVal,
            msgRaw: newVal,
          },
        };
      });
    },
    [setFormValues, value, setFormErrors],
  );

  const handleClickHash = React.useCallback(async () => {
    if (value && value.msgRaw) {
      const msgRaw = value.msgRaw;
      const msgRawInt = stringToBigInt(msgRaw);
      const bytes = await poseidon_2_bigint([msgRawInt, BigInt(0)]);
      const msgHash = bytesLeToBigInt(bytes);

      setFormValues(oldVals => ({
        ...oldVals,
        [circuitInput.name]: {
          msgRaw,
          msgRawInt,
          msgHash,
        },
      }));
    } else {
      setFormErrors(oldVals => {
        const newVals = { ...oldVals, [circuitInput.name]: "Type some value to hash" };
        return newVals;
      });
    }
  }, [value, setFormValues]);

  return (
    <FormInput>
      <FormInputTitleRow>
        <FormInputTitle>{circuitInput.label}</FormInputTitle>
        <FormInputBtnRow>
          <button className={styles.hashBtn} onClick={handleClickHash} type="button">
            {i18n.hash}
          </button>
        </FormInputBtnRow>
      </FormInputTitleRow>
      <InputWrapper>
        <div className={styles.interactiveArea}>
          <input
            placeholder={circuitInput.desc}
            value={value?.msgRaw?.toString() || ""}
            onChange={handleChangeRaw}
          />
        </div>
      </InputWrapper>
      {value?.msgHash ? <ComputedValue value={value} /> : null}
      {error && <FormError>{error}</FormError>}
    </FormInput>
  );
};

export default HashInput;

// export interface HashData {
//   msgRaw: string | null;
//   msgRawInt: bigint | null;
//   msgHash: bigint | null;
// }

export interface HashInputProps {
  circuitInput: CircuitInput;
  value: HashData | undefined;
  error: string | undefined;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export interface ComputedValueProps {
  value: HashData | undefined;
}
