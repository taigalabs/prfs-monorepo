"use client";

import React from "react";

import styles from "./Home.module.scss";
import { i18nContext } from "@/contexts/i18n";
import useLocalWallet from "@/hooks/useLocalWallet";

const Home: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  return <div>Invalid access. Check URL</div>;
};

export default Home;
