import React from "react";
import cn from "classnames";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";

import styles from "./CreateDataSuccess.module.scss";
import { i18nContext } from "@/i18n/context";

const CreateDataSuccess: React.FC<EncryptedWalletAddrItemProps> = ({}) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <FaCheck className={styles.green} />
      <span>{i18n.successfully_created_data}</span>
    </div>
  );
};

export default CreateDataSuccess;

export interface EncryptedWalletAddrItemProps {}
