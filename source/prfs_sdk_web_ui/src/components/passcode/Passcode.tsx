import React from "react";
import cn from "classnames";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { Msg, sendMsgToParent } from "@taigalabs/prfs-sdk-web";
import { FaSignature } from "@react-icons/all-files/fa/FaSignature";

import styles from "./Passcode.module.scss";
import { i18nContext } from "@/contexts/i18n";

const Passcode: React.FC<PasscodeProps> = ({ handleChangeValue, name, placeholder, value }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.sigDataInputWrapper}>
      <input
        name={name}
        placeholder={placeholder}
        value={value || ""}
        onChange={handleChangeValue}
      />
    </div>
  );
};

export default Passcode;

export interface PasscodeProps {
  name: string;
  placeholder: string;
  value: string;
  handleChangeValue: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}
