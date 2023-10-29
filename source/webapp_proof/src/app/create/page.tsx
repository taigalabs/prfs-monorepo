import React from "react";

import styles from "./page.module.scss";
import DefaultLayout, { DefaultBody, DefaultFooter } from "@/layouts/default_layout/DefaultLayout";
import CreateProofForm from "@/components/create_proof_form/CreateProofForm";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import Tutorial from "@/components/tutorial/Tutorial";
// import ProofTypeMasthead from "@/components/masthead/ProofTypeMasthead";

const CreatePage = () => {
  return (
    <DefaultLayout>
      {/* <ProofTypeMasthead /> */}
      <DefaultBody>
        <div className={styles.container}>
          <Tutorial />
          <CreateProofForm />
        </div>
      </DefaultBody>
      <DefaultFooter>
        <GlobalFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default CreatePage;
