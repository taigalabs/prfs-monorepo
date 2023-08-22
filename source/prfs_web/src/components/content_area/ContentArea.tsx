import React from "react";

import styles from "./ContentArea.module.scss";

const ContentAreaHeader: React.FC<ContentAreaHeaderProps> = ({ children }) => {
  return (
    <>
      <div className={styles.floatingHeader}>
        {/* <div> */}
        <div className={styles.content}>{children}</div>
        {/* </div> */}
      </div>
      <div className={styles.placeholder} />
    </>
  );
};

export default ContentAreaHeader;

export interface ContentAreaHeaderProps {
  children: React.ReactNode;
}
