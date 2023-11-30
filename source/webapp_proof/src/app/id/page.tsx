import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import CreateProofForm from "@/components/create_proof_form/CreateProofForm";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import CreateProofFormFallback from "@/components/create_proof_form/CreateProofFormFallback";
import IdLayout from "@/components/layouts/id_layout/IdLayout";

const IdPage = () => {
  return (
    <IdLayout>
      id
      {/* <DefaultBody noTopPadding> */}
      {/*   <div className={styles.container}> */}
      {/*     <Suspense fallback={<CreateProofFormFallback />}> */}
      {/*       <CreateProofForm /> */}
      {/*     </Suspense> */}
      {/*   </div> */}
      {/* </DefaultBody> */}
      {/* <DefaultFooter> */}
      {/*   <GlobalFooter /> */}
      {/* </DefaultFooter> */}
    </IdLayout>
  );
};

export default IdPage;
