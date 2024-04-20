import React from "react";
import cn from "classnames";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";

import styles from "./ShowDetail.module.scss";
import { i18nContext } from "@/i18n/context";

const ShowDetail: React.FC<EncryptedWalletAddrItemProps> = ({ showDetail, setShowDetail }) => {
  const i18n = React.useContext(i18nContext);

  const toggleShowDetail = React.useCallback(() => {
    setShowDetail(v => !v);
  }, [setShowDetail]);

  return (
    <div className={styles.showDetailBtnRow}>
      <button type="button" onClick={toggleShowDetail}>
        <HoverableText>{showDetail ? i18n.hide_detail : i18n.show_detail}</HoverableText>
      </button>
    </div>
  );
};

export default ShowDetail;

export interface EncryptedWalletAddrItemProps {
  showDetail: boolean;
  setShowDetail: React.Dispatch<React.SetStateAction<boolean>>;
}
