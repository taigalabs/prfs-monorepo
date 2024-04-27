import React from "react";
import { IoMdArrowDropdown } from "@react-icons/all-files/io/IoMdArrowDropdown";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";

import styles from "./ChannelNotice.module.scss";
import Button from "@/components/button/Button";
import { envs } from "@/envs";

const ChannelNotice: React.FC<ChannelNoticeProps> = ({}) => {
  const i18n = usePrfsI18N();

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <div className={styles.section}></div>
        <div className={styles.section}>
          <p>
            Shy is an anonymous social using proof of credentials. To start, you need to have your
            data attested.
          </p>
          <div className={styles.sectionRow}>
            <a href={envs.NEXT_PUBLIC_PRFS_PROOF_WEBAPP_ENDPOINT}>
              <button className={styles.atstBtn}>Start with attestation</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelNotice;

export interface ChannelNoticeProps {}
