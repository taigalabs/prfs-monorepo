"use client";

import React from "react";
import { useRouter } from "next/navigation";

import styles from "./HomePage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const HomePage: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  React.useEffect(() => {
    router.push(`${paths.c}/crypto`);
  }, [router]);

  return <div>Redirecting...</div>;
};

export default HomePage;
