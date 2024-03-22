import React from "react";
import cn from "classnames";
import { MdEnhancedEncryption } from "@react-icons/all-files/md/MdEnhancedEncryption";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";
import { EncryptType } from "@taigalabs/prfs-id-sdk-web";

import styles from "./EncryptItem.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  QueryItem,
  QueryItemLeftCol,
  QueryItemMeta,
  QueryItemRightCol,
} from "@/components/default_module/QueryItem";

const EncryptItem: React.FC<EncryptItemProps> = ({ name, val, type, encrypted }) => {
  const i18n = React.useContext(i18nContext);

  const hex = React.useMemo(() => {
    if (encrypted?.length > 14) {
      return abbrev7and5(encrypted);
    } else {
      return "";
    }
  }, [encrypted]);

  return (
    <QueryItem>
      <QueryItemMeta>
        <QueryItemLeftCol>
          <MdEnhancedEncryption />
        </QueryItemLeftCol>
        <QueryItemRightCol>
          <div className={styles.name}>{name}</div>
          <div className={styles.val}>Value: {val}</div>
          <div className={styles.type}>({type})</div>
          <div className={styles.hashed}>
            <span className={styles.label}>{i18n.encryption}: </span>
            <span>{hex}</span>
          </div>
        </QueryItemRightCol>
      </QueryItemMeta>
    </QueryItem>
  );
};

export default EncryptItem;

export interface EncryptItemProps {
  name: string;
  val: string;
  type: EncryptType;
  encrypted: string;
}
