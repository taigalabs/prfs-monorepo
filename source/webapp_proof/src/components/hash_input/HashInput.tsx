import React from "react";
import cn from "classnames";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";

import styles from "./HashInput.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { FormInput, FormInputTitleRow } from "@/components/form_input/FormInput";

const HashInput: React.FC<HashInputProps> = ({ circuitInput, value, setFormValues }) => {
  const i18n = React.useContext(i18nContext);

  React.useEffect(() => {
    if (value === undefined) {
      const defaultSigData: SigData = {
        msgRaw: "default message",
        msgHash: Buffer.from(""),
        sig: "",
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
    if (value) {
      const msgRaw = value.msgRaw;
      // const msgHash = hashPersonalMessage(Buffer.from(msgRaw));

      setFormValues(oldVals => ({
        ...oldVals,
        [circuitInput.name]: {
          msgRaw,
          // msgHash,
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
          [styles.isInputValid]: value && value.sig.length > 0,
        })}
      >
        <input placeholder={circuitInput.desc} value={value?.msgRaw || ""} readOnly />
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

export interface SigData {
  msgRaw: string;
  msgHash: Buffer;
  sig: string;
}

export interface HashInputProps {
  circuitInput: CircuitInput;
  value: SigData | undefined;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}
