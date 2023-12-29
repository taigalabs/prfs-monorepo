import React, { Suspense } from "react";

import styles from "./page.module.scss";
import { DefaultLayout, DefaultBody } from "@/components/layouts/default_layout/DefaultLayout";
import PrfsIdAppSignIn from "@/components/app_sign_in/PrfsIdAppSignIn";

const AppSignInPage = () => {
  return (
    <DefaultLayout>
      <DefaultBody>
        <Suspense>
          <PrfsIdAppSignIn />
        </Suspense>
      </DefaultBody>
    </DefaultLayout>
  );
};

export default AppSignInPage;
