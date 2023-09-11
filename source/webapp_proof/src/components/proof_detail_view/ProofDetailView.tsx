import React from "react";
import Link from "next/link";
import ActiveLink from "@taigalabs/prfs-react-components/src/active_link/ActiveLink";

import styles from "./ProofDetailView.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const ProofDetailView: React.FC<ProofDetailViewProps> = () => {
  const i18n = React.useContext(i18nContext);

  return <div className={styles.wrapper}></div>;
};

export default ProofDetailView;

export interface ProofDetailViewProps {}
