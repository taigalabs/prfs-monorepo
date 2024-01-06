import React, { Suspense } from "react";

import styles from "./page.module.scss";
import { DefaultLayout, DefaultBody } from "@/components/layouts/default_layout/DefaultLayout";
import ProofGen from "@/components/proof_gen/ProofGen";
import { envs } from "@/envs";
import CommitHash from "@/components/commit_hash/CommitHash";

const ProofGenPage = () => {
  return (
    <DefaultLayout>
      <DefaultBody>
        <Suspense>
          <ProofGen />
        </Suspense>
      </DefaultBody>
      <CommitHash />
    </DefaultLayout>
  );
};

export default ProofGenPage;
