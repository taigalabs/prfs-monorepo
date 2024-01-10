"use client";

import React from "react";

import styles from "./MyAvatar.module.scss";
import { LocalShyCredential } from "@/storage/local_storage";

const MyAvatar: React.FC<MyAvatarProps> = ({ credential, handleClick }) => {
  const letter = React.useMemo(() => {
    if (credential.account_id && credential.account_id.length > 4) {
      return credential.account_id.substring(2, 5);
    } else {
      return "";
    }
  }, [credential]);

  return (
    <div
      className={styles.wrapper}
      style={{ backgroundColor: credential.avatar_color }}
      onClick={handleClick}
    >
      <span>{letter}</span>
    </div>
  );
};

export default MyAvatar;

export interface MyAvatarProps {
  credential: LocalShyCredential;
  handleClick?: () => void;
}
