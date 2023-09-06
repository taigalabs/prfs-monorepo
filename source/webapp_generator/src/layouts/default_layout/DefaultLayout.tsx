"use client";

import React from "react";
import { ThirdwebProvider } from "@thirdweb-dev/react";

import styles from "./DefaultLayout.module.scss";
import { I18nProvider } from "@/contexts/i18n";
import { StateProvider } from "@/contexts/state";
import { i18nContext } from "@/contexts/i18n";

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <ThirdwebProvider activeChain="ethereum">
      <StateProvider>
        <I18nProvider>
          <div className={styles.wrapper}>{children}</div>
        </I18nProvider>
      </StateProvider>
    </ThirdwebProvider>
  );
};

export default DefaultLayout;

export interface DefaultLayoutProps {
  children: React.ReactNode;
}
