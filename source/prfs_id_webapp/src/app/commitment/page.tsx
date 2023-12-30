import React, { Suspense } from "react";

import styles from "./page.module.scss";
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
  );
};

export default CommitmentPage;
