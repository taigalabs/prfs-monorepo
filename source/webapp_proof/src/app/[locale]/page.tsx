import { useTranslations } from "next-intl";

// export default function Index() {
//   const t = useTranslations("Index");
//   return <h1>{t("title")}</h1>;
// }

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import styles from "./page.module.scss";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout, { DefaultBody, DefaultFooter } from "@/layouts/default_layout/DefaultLayout";
import CreateProofForm from "@/components/create_proof_form/CreateProofForm";
import Masthead from "@/components/masthead/Masthead";
import ImageLogo from "@/components/image_logo/ImageLogo";
import HomeFooter from "./HomeFooter";

const HomePage = () => {
  return (
    <DefaultLayout>
      <Masthead variant="mini" />
      <DefaultBody>
        <div className={styles.container}>
          <div className={styles._inner}>
            <div className={styles.logoContainer}>
              <ImageLogo />
            </div>
            <CreateProofForm />
          </div>
        </div>
      </DefaultBody>
      <DefaultFooter>
        <HomeFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default HomePage;
