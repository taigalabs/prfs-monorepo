import React, { Suspense } from "react";

import styles from "./page.module.scss";
<<<<<<< HEAD
import { DefaultLayout, DefaultBody } from "@/components/layouts/default_layout/DefaultLayout";
import PrfsIdCommitment from "@/components/commitment/PrfsIdCommitment";

const CommitmentPage = () => {
  return (
    <DefaultLayout>
      <DefaultBody>
        <Suspense>
          <PrfsIdCommitment />
        </Suspense>
      </DefaultBody>
    </DefaultLayout>
=======
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
>>>>>>> main
  );
};

export default CommitmentPage;
