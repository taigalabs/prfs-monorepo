"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import styles from "./ProofsPage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import Masthead from "@/components/masthead/Masthead";
import ContentArea from "@/components/content_area/ContentArea";

const ExplorerPage: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  // const searchParams = useSearchParams();

  // React.useEffect(() => {
  //   const proofInstanceId = searchParams.get("proofInstanceId");
  // }, [searchParams]);

  return (
    <DefaultLayout>
      <Masthead />
      <ContentArea>
        <div className={styles.container}>proofs</div>
      </ContentArea>
    </DefaultLayout>
  );
};

export default ExplorerPage;
