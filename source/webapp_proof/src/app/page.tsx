import React from "react";
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";

import styles from "./page.module.scss";
import DefaultLayout, { DefaultBody, DefaultFooter } from "@/layouts/default_layout/DefaultLayout";
import CreateProofForm from "@/components/create_proof_form/CreateProofForm";
import Masthead from "@/components/masthead/Masthead";
import GlobalFooter from "@/components/global_footer/GlobalFooter";

const HomePage = () => {
  return (
    <DefaultLayout>
      <Masthead />
      <DefaultBody>
        <div className={styles.container}>
          <div className={styles._inner}>
            <div className={styles.logoContainer}>
              <ImageLogo width={150} />
            </div>
            <CreateProofForm />
          </div>
        </div>
      </DefaultBody>
      <DefaultFooter>
        <GlobalFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default HomePage;
