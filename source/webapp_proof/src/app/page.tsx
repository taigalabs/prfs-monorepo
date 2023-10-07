"use client";

import React from "react";
import { useRouter } from "next/navigation";

import styles from "./HomePage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout, { DefaultBody } from "@/layouts/default_layout/DefaultLayout";
import CreateProofForm from "@/components/create_proof_form/CreateProofForm";
import Masthead from "@/components/masthead/Masthead";
import Link from "next/link";
import { paths } from "@/paths";
import Logo from "@taigalabs/prfs-react-components/src/logo/Logo";

const HomePage: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <DefaultLayout>
      <Masthead variant="mini" />
      <DefaultBody>
        <div className={styles.container}>
          <div>
            <Logo variant="simple" appName={i18n.proof} beta />
            <CreateProofForm />
          </div>
        </div>
      </DefaultBody>
    </DefaultLayout>
  );
};

export default HomePage;
