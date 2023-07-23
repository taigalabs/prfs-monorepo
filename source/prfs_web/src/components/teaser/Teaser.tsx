import React from "react";
import Link from "next/link";

import styles from "./Table.module.scss";
import { i18nContext } from "@/contexts/i18n";

const Teaser: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  return <div>teaser</div>;
};

export default Teaser;
