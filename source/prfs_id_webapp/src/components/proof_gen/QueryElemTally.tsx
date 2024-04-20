import React from "react";
import { MdNoteAdd } from "@react-icons/all-files/md/MdNoteAdd";
import { MdEnhancedEncryption } from "@react-icons/all-files/md/MdEnhancedEncryption";
import { FaRegAddressCard } from "@react-icons/all-files/fa/FaRegAddressCard";
import { FaKey } from "@react-icons/all-files/fa/FaKey";

import styles from "./QueryElemTally.module.scss";
import { useI18N } from "@/i18n/context";
import { QueryElemTallyType } from "./query_elem";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";

const QueryElemTally: React.FC<QueryElemTallyProps> = ({ queryElemTally, setShowQueryDetail }) => {
  const i18n = useI18N();

  const elems = React.useMemo(() => {
    const el = [];
    const tally = queryElemTally;

    if (queryElemTally.commitment) {
      el.push(
        <span className={styles.item} key="commitment">
          <MdNoteAdd />
          Commitment ({tally.commitment})
        </span>,
      );
    }

    if (tally.encrypt) {
      el.push(
        <span className={styles.item} key="encrypt">
          <MdEnhancedEncryption />
          {i18n.encrypt} ({tally.encrypt})
        </span>,
      );
    }

    if (tally.app_sign_in) {
      el.push(
        <span className={styles.item} key="app_sign_in">
          <FaRegAddressCard />
          App sign in {tally.app_sign_in}
        </span>,
      );
    }

    if (tally.rand_key_pair) {
      el.push(
        <span className={styles.item} key="rand_key_pair">
          <FaKey />
          Rand key pair {tally.rand_key_pair}
        </span>,
      );
    }

    return el;
  }, [queryElemTally]);

  return (
    <div className={styles.wrapper}>
      <div>{elems}</div>
      <div className={styles.btnRow}>
        <button type="button">
          <HoverableText>{i18n.show_detail}</HoverableText>
        </button>
      </div>
    </div>
  );
};

export default QueryElemTally;

export interface QueryElemTallyProps {
  queryElemTally: QueryElemTallyType;
  setShowQueryDetail: React.Dispatch<React.SetStateAction<boolean>>;
}
