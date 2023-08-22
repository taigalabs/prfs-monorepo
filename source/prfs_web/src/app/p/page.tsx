"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { stateContext } from "@/contexts/state";
import styles from "./Home.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Teaser from "@/components/teaser/Teaser";
import { paths } from "@/paths";

const PPage: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  React.useEffect(() => {
    // if (process.env.NEXT_PUBLIC_IS_TEASER !== "yes") {
    //   router.push(paths.proof__proof_instances);
    // }
  }, [router]);

  return <div>{i18n.redirecting}</div>;
};

export default PPage;
