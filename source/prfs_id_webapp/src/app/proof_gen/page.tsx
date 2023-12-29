import React, { Suspense } from "react";

import styles from "./page.module.scss";
import { DefaultLayout, DefaultBody } from "@/components/layouts/default_layout/DefaultLayout";
import ProofGen from "@/components/proof_gen/ProofGen";

const ProofGenPage = () => {
  return (
    <DefaultLayout>
      <DefaultBody>
        <ProofGen />
      </DefaultBody>
    </DefaultLayout>
  );
};

export default ProofGenPage;
