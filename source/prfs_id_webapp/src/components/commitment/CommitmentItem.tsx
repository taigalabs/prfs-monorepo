import React from "react";
import cn from "classnames";
import { MdNoteAdd } from "@react-icons/all-files/md/MdNoteAdd";
import { CommitmentType } from "@taigalabs/prfs-id-sdk-web";

import styles from "./CommitmentItem.module.scss";
import { i18nContext } from "@/i18n/context";

export const CommitmentItemList: React.FC<CommitmentItemListProps> = ({ children }) => {
  return <ul className={styles.list}>{children}</ul>;
};

export const CommitmentItem: React.FC<CommitmentItemItemProps> = ({
  name,
  hashedHex,
  val,
  type,
}) => {
  const i18n = React.useContext(i18nContext);

  return (
    <li className={styles.item}>
      <div className={styles.leftCol}>
        <MdNoteAdd />
      </div>
      <div className={styles.rightCol}>
        <div className={styles.name}>{name}</div>
        <div className={styles.val}>Value: {val}</div>
        <div className={styles.type}>({type})</div>
        <div className={styles.hashed}>
          <span className={styles.label}>{i18n.commitment}: </span>
          <span>{hashedHex}</span>
        </div>
      </div>
    </li>
  );
};

export interface CommitmentItemListProps {
  children: React.ReactNode;
}

export interface CommitmentItemItemProps {
  name: string;
  hashedHex: string;
  val: string;
  type: CommitmentType;
}
