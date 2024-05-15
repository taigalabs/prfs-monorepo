import React from "react";
import { FaPen } from "@react-icons/all-files/fa/FaPen";

import styles from "./ZeroCommentMsg.module.scss";
import { useShyI18N } from "@/i18n";

const ZeroCommentMsg: React.FC<RowProps> = ({}) => {
  const i18n = useShyI18N();

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <FaPen />
      </div>
      <div>
        <p className={styles.title}>{i18n.be_the_first_to_comment}</p>
        <p className={styles.content}>{i18n.nobody_responded_to_this_post_yet}</p>
      </div>
    </div>
  );
};

export default ZeroCommentMsg;

export interface RowProps {}
