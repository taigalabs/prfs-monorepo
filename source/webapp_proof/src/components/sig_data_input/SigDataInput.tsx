import React from "react";
import cn from "classnames";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { FaSignature } from "@react-icons/all-files/fa/FaSignature";
import { hashPersonalMessage } from "@ethereumjs/util";

import styles from "./SigDataInput.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { FormInput, FormInputTitleRow } from "../form_input/FormInput";
import { useSignMessage } from "wagmi";

const SigDataInput: React.FC<SigDataInputProps> = ({ circuitInput, value, setFormValues }) => {
  const i18n = React.useContext(i18nContext);
  // const [message, setMessage] = React.useState("");
  const { signMessageAsync } = useSignMessage();

  // React.useEffect(() => {
  //   if (value === undefined) {
  //     const defaultSigData: SigData = {
  //       msgRaw: "",
  //       msgHash: Buffer.from(""),
  //       sig: "",
  //     };

  //     setFormValues(oldVals => {
  //       return {
  //         ...oldVals,
  //         [circuitInput.name]: defaultSigData,
  //       };
  //     });
  //   }
  // }, [value, setFormValues]);

  const handleChangeRaw = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = ev.target;

      setFormValues(oldVals => {
        const oldVal = oldVals[circuitInput.name] || {};

        return {
          ...oldVals,
          [circuitInput.name]: {
            ...oldVal,
            msgRaw: value,
          },
        };
      });
    },
    [setFormValues]
  );

  const handleClickSign = React.useCallback(async () => {
    if (value) {
      const msgRaw = value.msgRaw;
      const msgHash = hashPersonalMessage(Buffer.from(msgRaw));
      const sig = await signMessageAsync({ message: msgRaw });

      setFormValues(oldVals => ({
        ...oldVals,
        [circuitInput.name]: {
          msgRaw,
          msgHash,
          sig,
        },
      }));
    }
  }, [value, setFormValues, signMessageAsync]);

  console.log(22, value);

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
          value={value?.msgRaw || ""}
          onChange={handleChangeRaw}
        />
        <div className={styles.btnGroup}>
          <button className={styles.connectBtn} onClick={handleClickSign}>
            {i18n.sign}
          </button>
        </div>
      </div>
    </FormInput>
  );
};

export default SigDataInput;

export interface SigData {
  msgRaw: string;
  msgHash: Buffer;
  sig: string;
}

export interface SigDataInputProps {
  circuitInput: CircuitInput;
  value: SigData | undefined;
  error: string | undefined;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}
