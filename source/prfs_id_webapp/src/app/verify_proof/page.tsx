import React, { Suspense } from "react";

import styles from "./page.module.scss";
import { DefaultLayout, DefaultBody } from "@/components/layouts/default_layout/DefaultLayout";
import VerifyProof from "@/components/verify_proof/VerifyProof";

const VerifyProofPage = () => {
  return (
    <DefaultLayout>
      <DefaultBody>
        <Suspense>
          <VerifyProof />
        </Suspense>
      </DefaultBody>
    </DefaultLayout>
  );
};

export default VerifyProofPage;
