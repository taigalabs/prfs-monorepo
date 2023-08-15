import React from "react";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { GetSignatureMsg, sendMsgToParent } from "@taigalabs/prfs-sdk-web";

import styles from "./SigDataInput.module.scss";
import { i18nContext } from "@/contexts/i18n";

const SigDataInput: React.FC<SigDataInputProps> = ({ circuitInput, value, setFormValues }) => {
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

  const handleClickSign = React.useCallback(async () => {
    if (value) {
      const msgRaw = value.msgRaw;
      const msgHash = Buffer.from(msgRaw);
      const sig = await sendMsgToParent(new GetSignatureMsg(msgHash));

      setFormValues(oldVals => ({
        ...oldVals,
        [circuitInput.name]: {
          msgRaw,
          msgHash,
          sig,
        },
      }));
    }
  }, [value, setFormValues]);

  return (
    <div className={styles.sigDataInputWrapper}>
      <input placeholder={circuitInput.desc} value={value?.msgRaw || ""} readOnly />
      <div className={styles.btnGroup}>
        <p className={styles.signed}>{value?.sig ? i18n.signed : ""}</p>
        <button className={styles.connectBtn} onClick={handleClickSign}>
          {i18n.sign}
        </button>
      </div>
    </div>
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
