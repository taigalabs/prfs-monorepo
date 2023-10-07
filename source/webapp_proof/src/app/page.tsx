"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import styles from "./HomePage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout, { DefaultBody } from "@/layouts/default_layout/DefaultLayout";
import CreateProofForm from "@/components/create_proof_form/CreateProofForm";
import Masthead from "@/components/masthead/Masthead";
import { paths } from "@/paths";
import Logo from "@taigalabs/prfs-react-components/src/logo/Logo";
import Icon from "./prfs_logo2.svg";

const HomePage: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <DefaultLayout>
      <Masthead variant="mini" />
      <DefaultBody>
        <div className={styles.container}>
          <div className={styles._inner}>
            <div className={styles.logoContainer}>
              <Icon />
            </div>
            <CreateProofForm />
          </div>
        </div>
      </DefaultBody>
    </DefaultLayout>
  );
};

export default HomePage;
