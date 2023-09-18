"use client";

import React from "react";
import { useRouter } from "next/navigation";

import styles from "./Home.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const PPage: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  React.useEffect(() => {
    router.push(paths.__);
  }, [router]);

  return <div>{i18n.redirecting}</div>;
};

export default PPage;
