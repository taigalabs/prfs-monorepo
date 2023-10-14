import React from "react";
import cn from "classnames";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";

import styles from "./HashInput.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { FormInput, FormInputTitleRow } from "@/components/form_input/FormInput";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";

const HashInput: React.FC<HashInputProps> = ({
  circuitInput,
  value,
  setFormValues,
  proofGenElement,
}) => {
  const i18n = React.useContext(i18nContext);

  React.useEffect(() => {
    if (value === undefined) {
      const defaultSigData: HashData = {
        msgRaw: BigInt(0),
        msgHash: BigInt(0),
      };

      setFormValues(oldVals => {
        return {
          ...oldVals,
          [circuitInput.name]: defaultSigData,
        };
      });
    }
  }, [value, setFormValues]);

  const handleClickHash = React.useCallback(async () => {
    if (!proofGenElement.state.driverVersion) {
      console.warn("Driver is not yet loaded");
      return null;
    }

    if (value) {
      const msgRaw = value.msgRaw;
      console.log(123123, msgRaw);

      const msgHash = await proofGenElement.hash([msgRaw]);

      console.log(222, msgHash);

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
        <input placeholder={circuitInput.desc} value={value?.msgRaw.toString() || ""} readOnly />
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
  msgRaw: bigint;
  msgHash: bigint;
}

export interface HashInputProps {
  circuitInput: CircuitInput;
  value: HashData | undefined;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  proofGenElement: ProofGenElement;
}
