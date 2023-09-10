"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import styles from "./ExplorerPage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const ExplorerPage: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const proofInstanceId = searchParams.get("proofInstanceId");
  }, [searchParams]);

  return <div>{i18n.loading}...</div>;
};

export default ExplorerPage;
