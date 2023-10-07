"use client";

import React from "react";
import { redirect, useRouter } from "next/navigation";

import styles from "./Home.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const PPage: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  redirect(paths.__);
};

export default PPage;
