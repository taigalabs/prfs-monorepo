import React, { Suspense } from "react";

import styles from "./page.module.scss";
import IdLayout, { IdBody } from "@/components/layouts/id_layout/IdLayout";
import SignIn from "@/components/sign_in/SignIn";

const IdPage = () => {
  return (
    <IdLayout>
      <IdBody>
        <SignIn />
      </IdBody>
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
