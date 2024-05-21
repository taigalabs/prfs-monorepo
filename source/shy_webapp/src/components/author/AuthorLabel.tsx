import React from "react";
import cn from "classnames";

import styles from "./AuthorLabel.module.scss";

const AuthorLabel: React.FC<AuthorProps> = ({ publicKey }) => {
  const pk = React.useMemo(() => {
    return publicKey.substring(0, 8) || "";
  }, [publicKey]);

  return <div className={styles.wrapper}>{pk}</div>;
};

export default AuthorLabel;

export interface AuthorProps {
  publicKey: string;
}
