import React from "react";
import cn from "classnames";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { Msg, sendMsgToParent } from "@taigalabs/prfs-sdk-web";
import { FaSignature } from "@react-icons/all-files/fa/FaSignature";

import styles from "./Passcode.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { FormInput, FormInputTitleRow } from "../form_input/FormInput";

const Passcode: React.FC<PasscodeProps> = ({ handleChangeValue, circuitInput, value, confirm }) => {
  // const i18n = React.useContext(i18nContext);

  return (
    <FormInput>
      <FormInputTitleRow>
        <p>{circuitInput.label}</p>
      </FormInputTitleRow>
      <div className={styles.sigDataInputWrapper}>
        <input
          type="password"
          name={circuitInput.name}
          placeholder={circuitInput.desc}
          value={value || ""}
          onChange={handleChangeValue}
        />
      </div>
    </FormInput>
  );
};

export default Passcode;

export interface PasscodeProps {
  // name: string;
  // placeholder: string;
  circuitInput: CircuitInput;
  value: string;
  handleChangeValue: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  confirm?: boolean;
}
