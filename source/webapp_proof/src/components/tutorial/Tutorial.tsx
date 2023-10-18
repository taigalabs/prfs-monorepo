import React from "react";
import Logo from "@taigalabs/prfs-react-components/src/logo/Logo";
import Link from "next/link";
import ActiveLink from "@taigalabs/prfs-react-components/src/active_link/ActiveLink";
import PrfsAppsPopover from "@taigalabs/prfs-react-components/src/prfs_apps_popover/PrfsAppsPopover";

import styles from "./Tutorial.module.scss";
import { i18nContext } from "@/contexts/i18n";

const Tutorial: React.FC<TutorialProps> = () => {
  const i18n = React.useContext(i18nContext);

  return <div className={styles.wrapper}>power</div>;
};

export default Tutorial;

export interface TutorialProps {}
