import type { Component, JSX } from "solid-js";
import { useContext } from "solid-js";

import styles from "./DefaultLayout.module.scss";
import { I18nContext } from "@/contexts/i18n";

const DefaultLayout: Component<DefaultLayoutProps> = ({ children }) => {
  const i18n = useContext(I18nContext);

  return (
    <div class={styles.wrapper}>
      <div>{children}</div>
      <div class={styles.powered}>{i18n.powered_by_prfs_web_sdk}</div>
    </div>
  );
};

export default DefaultLayout;

export interface DefaultLayoutProps {
  children: JSX.Element;
}
