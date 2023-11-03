import React from "react";

import styles from "./page.module.scss";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import CreateProofForm from "@/components/create_proof_form/CreateProofForm";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import Tutorial from "@/components/tutorial/Tutorial";

const CreatePage = () => {
  return (
    <DefaultLayout>
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
