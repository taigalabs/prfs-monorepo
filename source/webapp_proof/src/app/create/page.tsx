import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import CreateProofForm from "@/components/create_proof_form/CreateProofForm";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import CreateProofFormFallback from "@/components/create_proof_form/CreateProofFormFallback";

const CreatePage = () => {
  return (
    <DefaultLayout>
      <DefaultBody noTopPadding>
        <div className={styles.container}>
          <Suspense fallback={<CreateProofFormFallback />}>
            <CreateProofForm />
          </Suspense>
        </div>
      </DefaultBody>
      {/* <DefaultFooter> */}
      {/*   <GlobalFooter /> */}
      {/* </DefaultFooter> */}
    </DefaultLayout>
  );
};

export default CreatePage;
