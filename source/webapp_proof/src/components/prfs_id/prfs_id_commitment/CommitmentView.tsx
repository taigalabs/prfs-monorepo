import React from "react";
import cn from "classnames";
import { MdNoteAdd } from "@react-icons/all-files/md/MdNoteAdd";
import { CommitmentType } from "@taigalabs/prfs-id-sdk-web";

import styles from "./CommitmentView.module.scss";
import { i18nContext } from "@/i18n/context";

export const CommitmentViewList: React.FC<CommitmentViewListProps> = ({ children }) => {
  return <ul className={styles.list}>{children}</ul>;
};

export const CommitmentViewItem: React.FC<CommitmentViewItemProps> = ({
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
        <div className={styles.hashed}>{hashedHex}</div>
      </div>
    </li>
  );
};

export interface CommitmentViewListProps {
  children: React.ReactNode;
}

export interface CommitmentViewItemProps {
  name: string;
  hashedHex: string;
  val: string;
  type: CommitmentType;
}
