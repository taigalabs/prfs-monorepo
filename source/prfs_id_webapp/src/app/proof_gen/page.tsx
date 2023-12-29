import React, { Suspense } from "react";

import styles from "./page.module.scss";
import { DefaultLayout, DefaultBody } from "@/components/layouts/default_layout/DefaultLayout";

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
