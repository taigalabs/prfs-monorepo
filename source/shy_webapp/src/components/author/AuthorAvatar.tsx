import React from "react";
import cn from "classnames";
import { makeIdentityColor } from "@taigalabs/prfs-id-sdk-web";

import styles from "./AuthorAvatar.module.scss";

const AuthorAvatar: React.FC<AuthorProps> = ({ publicKey }) => {
  const label = React.useMemo(() => {
    return publicKey.length > 7 ? publicKey.substring(4, 7) : publicKey.substring(0, 3);
  }, [publicKey]);

  const color = React.useMemo(() => {
    return makeIdentityColor(publicKey);
  }, [publicKey]);

  return (
    <div className={styles.wrapper} style={{ backgroundColor: color }}>
      {label}
    </div>
  );
};

export default AuthorAvatar;

export interface AuthorProps {
  publicKey: string;
}
