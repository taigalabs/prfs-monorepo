import { useContext, type Component } from "solid-js";

import styles from "./Loading.module.scss";
import { I18nContext } from "@/contexts/i18n";

const Loading: Component<LoadingProps> = () => {
  const i18n = useContext(I18nContext);

  return <div class={styles.wrapper}>{i18n.loading}</div>;
};

export default Loading;

export interface LoadingProps {}
