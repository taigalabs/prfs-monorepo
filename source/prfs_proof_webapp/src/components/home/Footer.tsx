import React from "react";
import cn from "classnames";

import styles from "./Footer.module.scss";
import { useI18N } from "@/i18n/use_i18n";

const Footer: React.FC<LogoContainerProps> = () => {
  const i18n = useI18N();

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.firstCol}>
          <p>{i18n.english}</p>
        </div>
        <div className={styles.col}>
          <ul className={styles.list}>
            <li className={styles.item}>
              <a href="https://twitter.com/shy_chat">
                <span>Twitter (Shy)</span>
              </a>
            </li>
            <li className={styles.item}>
              <a href="https://t.me/shy_chat">
                <span>Telegram (Shy)</span>
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.col}>
          <ul className={styles.list}>
            <li className={styles.item}>
              <a href={process.env.NEXT_PUBLIC_PRFS_DOCS_WEBSITE_ENDPOINT}>
                <span>Documentation</span>
              </a>
            </li>
            <li className={styles.item}>
              <a href={process.env.NEXT_PUBLIC_CODE_REPOSITORY_URL}>
                <span>Github</span>
              </a>
            </li>
            <li className={styles.item}>
              <a href="https://www.taigalabs.xyz">
                <span>Taiga Labs</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;

export interface LogoContainerProps {}
