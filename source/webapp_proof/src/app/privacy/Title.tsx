"use client";

import React from "react";

import styles from "./Logo.module.scss";
import { i18nContext } from "@/contexts/i18n";

const Title = () => {
  const i18n = React.useContext(i18nContext);

  return <div>{i18n.privacy}</div>;
};

export default Title;
