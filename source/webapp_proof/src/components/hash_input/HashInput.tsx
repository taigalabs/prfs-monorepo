import React from "react";
import cn from "classnames";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";

import styles from "./HashInput.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { FormInput, FormInputTitleRow } from "@/components/form_input/FormInput";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";
import { isNumber } from "util";
import { bigIntToBuffer, bufferToBigInt } from "@ethereumjs/util";
import { useSelector } from "react-redux";
import { tutorialSlice } from "@/state/tutorialReducer";
import { useAppSelector } from "@/state/hooks";

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
        msgRaw: "",
        msgHash: BigInt(0),
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
      const newVal = ev.target.value;

      // if (isNaN(+newVal)) {
      //   return;
      // }

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
    [setFormValues, value]
  );

  const handleClickHash = React.useCallback(async () => {
    if (!proofGenElement.state.driverVersion) {
      console.warn("Driver is not yet loaded");
      return null;
    }

    if (value) {
      const msgRaw = value.msgRaw;
      console.log("msg raw", msgRaw);

      const msg = bufferToBigInt(Buffer.from(msgRaw));

      const msgHash = await proofGenElement.hash([msg, BigInt(0)]);

      console.log("msg hash", msgHash);

      setFormValues(oldVals => ({
        ...oldVals,
        [circuitInput.name]: {
          msgRaw,
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
      <div
        className={cn({
          [styles.inputWrapper]: true,
        })}
      >
        <input
          placeholder={circuitInput.desc}
          value={value?.msgRaw.toString() || ""}
          onChange={handleChangeRaw}
        />
        <div className={styles.btnGroup}>
          <button className={styles.connectBtn} onClick={handleClickHash}>
            {i18n.hash}
          </button>
        </div>
      </div>
    </FormInput>
  );
};

export default HashInput;

export interface HashData {
  msgRaw: string;
  msgHash: bigint;
}

export interface HashInputProps {
  circuitInput: CircuitInput;
  value: HashData | undefined;
  error: string | undefined;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  proofGenElement: ProofGenElement;
}
