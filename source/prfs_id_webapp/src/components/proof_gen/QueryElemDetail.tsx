import React from "react";
import cn from "classnames";
import { MdNoteAdd } from "@react-icons/all-files/md/MdNoteAdd";
import { MdEnhancedEncryption } from "@react-icons/all-files/md/MdEnhancedEncryption";
import { FaRegAddressCard } from "@react-icons/all-files/fa/FaRegAddressCard";
import { FaKey } from "@react-icons/all-files/fa/FaKey";

import styles from "./QueryElemDetail.module.scss";
import { useI18N } from "@/i18n/context";
import { QueryElemTallyType } from "./query_elem";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";

const QueryElemDetail: React.FC<QueryElemTallyProps> = ({
  queryElems,
  proofGenElems,
  showQueryDetail,
  setShowQueryDetail,
}) => {
  const i18n = useI18N();

  const hideQueryElemDetail = React.useCallback(() => {
    setShowQueryDetail(false);
  }, [setShowQueryDetail]);

  return (
    <div className={cn(styles.wrapper)}>
      <div
        className={cn(styles.foldable, {
          [styles.display]: showQueryDetail,
        })}
      >
        {queryElems}
        {/* <div className={styles.hideDetailBtnRow}> */}
        {/*   <button type="button" onClick={hideQueryElemDetail}> */}
        {/*     <HoverableText>{i18n.hide_detail}</HoverableText> */}
        {/*   </button> */}
        {/* </div> */}
      </div>
      <div>{proofGenElems}</div>
    </div>
  );
};

export default QueryElemDetail;

export interface QueryElemTallyProps {
  showQueryDetail: boolean;
  queryElems: React.ReactNode;
  proofGenElems: React.ReactNode;
  setShowQueryDetail: React.Dispatch<React.SetStateAction<boolean>>;
}
