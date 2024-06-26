import React from "react";
import cn from "classnames";
import { MdNoteAdd } from "@react-icons/all-files/md/MdNoteAdd";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";
import { CommitmentType } from "@taigalabs/prfs-id-sdk-web";

import styles from "./CommitmentItem.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  QueryItem,
  QueryItemLeftCol,
  QueryItemMeta,
  QueryItemRightCol,
} from "@/components/query_item/QueryItemComponents";

const CommitmentItem: React.FC<CommitmentItemProps> = ({ name, hashedHex, val, type }) => {
  const i18n = React.useContext(i18nContext);

  const hex = React.useMemo(() => {
    if (hashedHex?.length > 14) {
      return abbrev7and5(hashedHex);
    } else {
      return "";
    }
  }, [hashedHex]);

  return (
    <QueryItem>
      <QueryItemMeta>
        <QueryItemLeftCol>
          <MdNoteAdd />
        </QueryItemLeftCol>
        <QueryItemRightCol>
          <div className={styles.name}>{name}</div>
          <div className={styles.val}>Value: {val}</div>
          <div className={styles.type}>({type})</div>
          <div className={styles.hashed}>
            <span className={styles.label}>{i18n.commitment}: </span>
            <span>{hex}</span>
          </div>
        </QueryItemRightCol>
      </QueryItemMeta>
    </QueryItem>
  );
};

export default CommitmentItem;

export interface CommitmentItemProps {
  name: string;
  hashedHex: string;
  val: string;
  type: CommitmentType;
}
