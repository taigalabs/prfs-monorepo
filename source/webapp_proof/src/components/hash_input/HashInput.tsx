import React from "react";
import cn from "classnames";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";
import { bigIntToBuffer, bufferToBigInt } from "@ethereumjs/util";

import styles from "./HashInput.module.scss";
import { i18nContext } from "@/contexts/i18n";
import {
  FormError,
  FormInput,
  FormInputTitleRow,
  InputWrapper,
} from "@/components/form_input/FormInput";
import Button from "@taigalabs/prfs-react-components/src/button/Button";

const ComputedValue: React.FC<ComputedValueProps> = ({ value }) => {
  const val = React.useMemo(() => {
    if (value && value.msgHash && value.msgRawInt) {
      const msgRawInt = "Msg: " + value.msgRawInt.toString().substring(0, 6) + "...";
      const msgHash = "Msg hash: " + value.msgHash.toString().substring(0, 12) + "...";

      return `${msgRawInt} / ${msgHash}`;
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
  proofGenElement,
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
    if (!proofGenElement.state.circuitDriverId) {
      console.warn("Driver is not yet loaded");
      return null;
    }

    if (value && value.msgRaw) {
      const msgRaw = value.msgRaw;
      const msgRawInt = bufferToBigInt(Buffer.from(msgRaw));
      const msgHash = await proofGenElement.hash([msgRawInt, BigInt(0)]);

      setFormValues(oldVals => ({
        ...oldVals,
        [circuitInput.name]: {
          msgRaw,
          msgRawInt,
          msgHash,
        },
      }));
    }
  }, [value, setFormValues]);

  return (
    <FormInput>
      <FormInputTitleRow>
        <p>{circuitInput.label}</p>
      </FormInputTitleRow>
      <InputWrapper>
        <div className={styles.interactiveArea}>
          <input
            placeholder={circuitInput.desc}
            value={value?.msgRaw?.toString() || ""}
            onChange={handleChangeRaw}
          />
          <div className={styles.btnGroup}>
            <Button
              variant="transparent_aqua_blue_1"
              handleClick={handleClickHash}
              className={styles.hashBtn}
            >
              {i18n.hash.toUpperCase()}
            </Button>
          </div>
        </div>
        {!!value?.msgHash && <ComputedValue value={value} />}
      </InputWrapper>
      {error && <FormError>{error}</FormError>}
    </FormInput>
  );
};

export default HashInput;

export interface HashData {
  msgRaw: string | null;
  msgRawInt: bigint | null;
  msgHash: bigint | null;
}

export interface HashInputProps {
  circuitInput: CircuitInput;
  value: HashData | undefined;
  error: string | undefined;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  proofGenElement: ProofGenElement;
}

export interface ComputedValueProps {
  value: HashData | undefined;
}
