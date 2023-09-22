import React from "react";
import cn from "classnames";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { Msg, sendMsgToParent } from "@taigalabs/prfs-sdk-web";
import { FaSignature } from "@react-icons/all-files/fa/FaSignature";

import styles from "./Passcode.module.scss";
import { i18nContext } from "@/contexts/i18n";

const Passcode: React.FC<PasscodeProps> = ({ circuitInput, value, handleChangeValue }) => {
  const i18n = React.useContext(i18nContext);

  React.useEffect(() => {
    if (value === undefined) {
      // const defaultSigData: SigData = {
      //   msgRaw: "default message",
      //   msgHash: Buffer.from(""),
      //   sig: "",
      // };
      // setFormValues(oldVals => {
      //   return {
      //     ...oldVals,
      //     [circuitInput.name]: defaultSigData,
      //   };
      // });
    }
  }, [value]);

  // const handleChangeValue = React.useCallback(async () => {
  //   if (value) {
  //     // const msgRaw = value.msgRaw;
  //     // const { msgHash, sig } = await sendMsgToParent(
  //     //   new Msg("GET_SIGNATURE", {
  //     //     msgRaw,
  //     //   })
  //     // );
  //     // setFormValues(oldVals => ({
  //     //   ...oldVals,
  //     //   [circuitInput.name]: {
  //     //     msgRaw,
  //     //     msgHash,
  //     //     sig,
  //     //   },
  //     // }));
  //   }

  //   // setFormValues(oldVals => ({
  //   //   ...oldVals,
  //   //   [circuitInput.name]: {
  //   //     msgRaw,
  //   //     msgHash,
  //   //     sig,
  //   //   },
  //   // }));
  // }, [value, setFormValues]);

  return (
    <div className={styles.sigDataInputWrapper}>
      <input
        name={circuitInput.name}
        placeholder={circuitInput.desc}
        value={value || ""}
        onChange={handleChangeValue}
      />
    </div>
  );
};

export default Passcode;

export interface PasscodeProps {
  circuitInput: CircuitInput;
  value: undefined;
  handleChangeValue: (ev: React.ChangeEvent) => void;
  // setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}
