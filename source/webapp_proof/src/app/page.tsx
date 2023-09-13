"use client";

import React from "react";
import { useRouter } from "next/navigation";

import styles from "./HomePage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import Masthead from "@/components/masthead/Masthead";
import ContentArea from "@/components/content_area/ContentArea";
import CreateProofForm from "@/components/create_proof_form/CreateProofForm";

const HomePage: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <DefaultLayout>
      <Masthead />
      <ContentArea>
        <div className={styles.container}>
          <CreateProofForm />
        </div>
      </ContentArea>
    </DefaultLayout>
  );
};

export default HomePage;
