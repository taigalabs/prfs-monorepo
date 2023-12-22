import React, { Suspense } from "react";

import styles from "./page.module.scss";
import SignInLayout, { SignInBody } from "@/components/layouts/sign_in_layout/SignInLayout";
import PrfsIdCommitment from "@/components/prfs_id/prfs_id_commitment/PrfsIdCommitment";

const CommitmentPage = () => {
  return (
    <SignInLayout>
      <SignInBody>
        <Suspense>
          <PrfsIdCommitment />
        </Suspense>
      </SignInBody>
    </SignInLayout>
  );
};

export default CommitmentPage;
