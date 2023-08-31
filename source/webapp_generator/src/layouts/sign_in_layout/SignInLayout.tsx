"use client";

import React from "react";
import Link from "next/link";
import { ThirdwebProvider } from "@thirdweb-dev/react";

import styles from "./SignInLayout.module.scss";
import { I18nProvider } from "@/contexts/i18n";
import { StateProvider } from "@/contexts/state";
import Logo from "@/components/logo/Logo";
import { i18nContext } from "@/contexts/i18n";

const SignInLayout: React.FC<SignInLayoutProps> = ({ children }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <ThirdwebProvider activeChain="ethereum">
      <StateProvider>
        <I18nProvider>
          <div className={styles.wrapper}>
            <div className={styles.inner}>
              <div className={styles.logoRow}>
                <Link href="/">
                  <Logo variant="big" />
                </Link>
              </div>
              <div>{children}</div>
              <div className={styles.footer}>{i18n.copyright}</div>
            </div>
          </div>
        </I18nProvider>
      </StateProvider>
    </ThirdwebProvider>
  );
};

export default SignInLayout;

export interface SignInLayoutProps {
  children: React.ReactNode;
}
