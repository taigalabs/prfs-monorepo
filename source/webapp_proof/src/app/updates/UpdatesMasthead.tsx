"use client";

import React from "react";

import styles from "./page.module.scss";
import DocMasthead from "@/components/masthead/DocMasthead";
import { paths } from "@/paths";
import { i18nContext } from "@/contexts/i18n";

const UpdatesMasthead = () => {
  const i18n = React.useContext(i18nContext);

  return <DocMasthead title={i18n.updates} titleHref={paths.__} />;
};

export default UpdatesMasthead;
