import React from "react";
import { IoMdArrowDropdown } from "@react-icons/all-files/io/IoMdArrowDropdown";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";

import styles from "./ChannelNotice.module.scss";
import Button from "@/components/button/Button";

const ChannelNotice: React.FC<ChannelNoticeProps> = ({}) => {
  const i18n = usePrfsI18N();

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <div className={styles.section}>1</div>
        <div className={styles.section}>2</div>
      </div>
    </div>
  );
};

export default ChannelNotice;

export interface ChannelNoticeProps {}
