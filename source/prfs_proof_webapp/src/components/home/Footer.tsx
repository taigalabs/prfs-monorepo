import React from "react";
import cn from "classnames";

import styles from "./Footer.module.scss";
import { useI18N } from "@/i18n/use_i18n";
import { envs } from "@/envs";

const Footer: React.FC<LogoContainerProps> = () => {
  const i18n = useI18N();

  const commitHash = React.useMemo(() => {
    return envs.NEXT_PUBLIC_GIT_COMMIT_HASH.substring(0, 6);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <ul className={styles.list}>
            <li>{i18n.english}</li>
            <li className={styles.commitHash}>{commitHash}</li>
          </ul>
        </div>
        <div className={styles.listContainer}>
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
                <a href={envs.NEXT_PUBLIC_PRFS_DOCS_WEBSITE_ENDPOINT}>
                  <span>Documentation</span>
                </a>
              </li>
              <li className={styles.item}>
                <a href={envs.NEXT_PUBLIC_CODE_REPOSITORY_URL}>
                  <span>Code</span>
                </a>
              </li>
              <li className={styles.item}>
                <a href={envs.NEXT_PUBLIC_TAIGALABS_ENDPOINT}>
                  <span>Taiga Labs</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

export interface LogoContainerProps {}
