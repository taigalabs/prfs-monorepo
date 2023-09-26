import React from "react";
import cn from "classnames";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { FaSignature } from "@react-icons/all-files/fa/FaSignature";
import { hashPersonalMessage } from "@ethereumjs/util";

import styles from "./SigDataInput.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { FormInput, FormInputTitleRow } from "../form_input/FormInput";
import { useSignMessage } from "wagmi";

const Signed: React.FC<SignedProps> = ({ sig }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div
      className={cn({
        [styles.signed]: true,
        [styles.signComplete]: sig && sig.length > 0,
      })}
    >
      <FaSignature />
    </div>
  );
};

const SigDataInput: React.FC<SigDataInputProps> = ({ circuitInput, value, setFormValues }) => {
  const i18n = React.useContext(i18nContext);
  const [message, setMessage] = React.useState("");
  const { signMessageAsync } = useSignMessage();

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

  const handleClickSign = React.useCallback(async () => {
    if (value) {
      const msgRaw = value.msgRaw;
      const msgHash = hashPersonalMessage(Buffer.from(msgRaw));
      const sig = await signMessageAsync({ message: msgRaw });

      console.log(55, sig);

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

  return (
    <FormInput>
      <FormInputTitleRow>
        <p>{circuitInput.label}</p>
      </FormInputTitleRow>
      <div className={styles.sigDataInputWrapper}>
        <input placeholder={circuitInput.desc} value={value?.msgRaw || ""} readOnly />
        <div className={styles.btnGroup}>
          <Signed sig={value?.sig} />
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
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

interface SignedProps {
  sig: string | undefined;
}
