import React, { Suspense } from "react";

import styles from "./page.module.scss";
import { DefaultLayout, DefaultBody } from "@/components/layouts/default_layout/DefaultLayout";
import Commitment from "@/components/commitment/Commitment";

const CommitmentPage = () => {
  return (
    <DefaultLayout>
      <DefaultBody>
        <Suspense>
          <Commitment />
        </Suspense>
      </DefaultBody>
    </DefaultLayout>
  );
};

export default CommitmentPage;
