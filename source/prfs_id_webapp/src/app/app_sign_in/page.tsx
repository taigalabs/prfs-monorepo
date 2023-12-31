import React, { Suspense } from "react";

import styles from "./page.module.scss";
import { DefaultLayout, DefaultBody } from "@/components/layouts/default_layout/DefaultLayout";
import AppSignIn from "@/components/app_sign_in/AppSignIn";

const AppSignInPage = () => {
  return (
    <DefaultLayout>
      <DefaultBody>
        <Suspense>
          <AppSignIn />
        </Suspense>
      </DefaultBody>
    </DefaultLayout>
  );
};

export default AppSignInPage;
