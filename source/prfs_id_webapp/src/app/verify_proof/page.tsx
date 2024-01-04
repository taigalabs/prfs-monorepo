import React, { Suspense } from "react";

import styles from "./page.module.scss";
import { DefaultLayout, DefaultBody } from "@/components/layouts/default_layout/DefaultLayout";
import ProofGen from "@/components/proof_gen/ProofGen";

const VerifyProofPage = () => {
  return (
    <DefaultLayout>
      <DefaultBody>
        <Suspense>
          <ProofGen />
        </Suspense>
      </DefaultBody>
    </DefaultLayout>
  );
};

export default VerifyProofPage;
