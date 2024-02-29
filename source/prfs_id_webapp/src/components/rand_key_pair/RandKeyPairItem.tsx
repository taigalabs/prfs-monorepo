import React from "react";
import cn from "classnames";
import { MdNoteAdd } from "@react-icons/all-files/md/MdNoteAdd";
import { RandKeyPairType } from "@taigalabs/prfs-id-sdk-web";

import styles from "./RandKeyPairItem.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  QueryItem,
  QueryItemLeftCol,
  QueryItemMeta,
  QueryItemRightCol,
} from "@/components/default_module/QueryItem";

const RandKeyPairItem: React.FC<RandKeyPairItemProps> = ({ name, hashedHex, val, type }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <QueryItem sidePadding>
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
            <span>{hashedHex}</span>
          </div>
        </QueryItemRightCol>
      </QueryItemMeta>
    </QueryItem>
  );
};

export default RandKeyPairItem;

export interface RandKeyPairItemProps {
  name: string;
  hashedHex: string;
  val: string;
  type: RandKeyPairType;
}
