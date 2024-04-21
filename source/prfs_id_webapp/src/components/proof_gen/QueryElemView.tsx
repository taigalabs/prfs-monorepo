import React from "react";
import cn from "classnames";
import { MdNoteAdd } from "@react-icons/all-files/md/MdNoteAdd";
import { MdEnhancedEncryption } from "@react-icons/all-files/md/MdEnhancedEncryption";
import { FaRegAddressCard } from "@react-icons/all-files/fa/FaRegAddressCard";
import { FaKey } from "@react-icons/all-files/fa/FaKey";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";

import styles from "./QueryElemView.module.scss";
import { useI18N } from "@/i18n/context";
import { QueryElemTallyType } from "./query_elem";

const QueryElemTally: React.FC<QueryElemTallyProps> = ({ queryElemTally }) => {
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

  return <div className={styles.wrapper}>{elems}</div>;
};

export interface QueryElemTallyProps {
  queryElemTally: QueryElemTallyType;
}

const QueryElemView: React.FC<QueryElemViewProps> = ({
  queryElems,
  queryElemTally,
  showQueryDetail,
  setShowQueryDetail,
}) => {
  const i18n = useI18N();

  const toggleShowDetail = React.useCallback(() => {
    setShowQueryDetail(v => !v);
  }, [setShowQueryDetail]);

  const hasNoFoldableElems = React.useMemo(() => {
    for (const key in queryElemTally) {
      if (queryElemTally[key as keyof QueryElemTallyType]) {
        return false;
      }
    }

    return true;
  }, [queryElemTally]);

  return (
    !hasNoFoldableElems && (
      <div className={cn(styles.wrapper)}>
        <div
          className={cn(styles.foldable, {
            [styles.display]: !showQueryDetail,
          })}
        >
          <QueryElemTally queryElemTally={queryElemTally} />
        </div>
        <div
          className={cn(styles.foldable, {
            [styles.display]: showQueryDetail,
          })}
        >
          {queryElems}
        </div>
        <div className={styles.btnRow}>
          <button type="button" onClick={toggleShowDetail}>
            <HoverableText>{showQueryDetail ? i18n.hide_detail : i18n.show_detail}</HoverableText>
          </button>
        </div>
      </div>
    )
  );
};

export default QueryElemView;

export interface QueryElemViewProps {
  showQueryDetail: boolean;
  queryElemTally: QueryElemTallyType;
  queryElems: React.ReactNode;
  setShowQueryDetail: React.Dispatch<React.SetStateAction<boolean>>;
}
