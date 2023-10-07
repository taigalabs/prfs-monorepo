"use client";

import React from "react";
import { useRouter } from "next/navigation";

import styles from "./HomePage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import ContentArea from "@/components/content_area/ContentArea";
import CreateProofForm from "@/components/create_proof_form/CreateProofForm";
import Masthead from "@/components/masthead/Masthead";
import Link from "next/link";
import { paths } from "@/paths";
import Logo from "@taigalabs/prfs-react-components/src/logo/Logo";

const HomePage: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <DefaultLayout>
      <Masthead />
      <ContentArea>
        <div className={styles.container}>
          <div className={styles.logoContainer}>
            <Link href={paths.__}>
              <Logo variant="simple" />
              <p className={styles.appName}>{i18n.proof}</p>
            </Link>
            <p className={styles.betaTag}>Beta</p>
          </div>
          <CreateProofForm />
        </div>
      </ContentArea>
    </DefaultLayout>
  );
};

export default HomePage;
