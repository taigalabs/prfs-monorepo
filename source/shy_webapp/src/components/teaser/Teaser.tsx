"use client";

import React from "react";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";

import styles from "./Teaser.module.scss";
import ShyLogo from "@/components/shy_logo/ShyLogo";

const Teaser: React.FC<TeaserProps> = () => {
  const i18n = usePrfsI18N();

  return (
    <div className={styles.wrapper}>
      <div className={styles.upper}>
        <div className={styles.inner}>
          <div className={styles.logoPane}>
            <div className={styles.logoWrapper}>
              <ShyLogo className={styles.logo} />
            </div>
          </div>
          <div className={styles.main}>
            <div className={styles.mainInner}>
              <div className={styles.intro}>
                <p className={styles.label}>{i18n.more_honest_discussions}</p>
                <p className={styles.desc}>Closed-beta open at 24/04/15 KST 21:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className={styles.footer}> */}
      {/*   <SignInFooter /> */}
      {/* </div> */}
    </div>
  );
};

export default Teaser;

export interface TeaserProps {}
