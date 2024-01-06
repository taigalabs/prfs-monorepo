import React, { Suspense } from "react";

import styles from "./page.module.scss";
import { DefaultLayout, DefaultBody } from "@/components/layouts/default_layout/DefaultLayout";
import VerifyProof from "@/components/verify_proof/VerifyProof";
import CommitHash from "@/components/commit_hash/CommitHash";

const VerifyProofPage = () => {
  return (
    <DefaultLayout>
      <DefaultBody>
        <Suspense>
          <VerifyProof />
        </Suspense>
      </DefaultBody>
      <CommitHash />
    </DefaultLayout>
  );
};

export default VerifyProofPage;
