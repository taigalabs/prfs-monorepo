"use client";

import React from "react";

import styles from "./Home.module.scss";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";

const Home: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <DefaultLayout docHeight={320} docWidth={484}>
      Invalid access. Check URL
    </DefaultLayout>
  );
};

export default Home;
