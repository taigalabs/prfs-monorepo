import React from "react";
import cn from "classnames";

import styles from "./AuthorAvatar.module.scss";

const AuthorAvatar: React.FC<AuthorProps> = ({ publicKey }) => {
  const label = React.useMemo(() => {
    return publicKey.length > 6 ? publicKey.substring(4, 6) : publicKey.substring(0, 2);
  }, [publicKey]);

  return <div className={styles.wrapper}>{label}</div>;
};

export default AuthorAvatar;

export interface AuthorProps {
  publicKey: string;
}
