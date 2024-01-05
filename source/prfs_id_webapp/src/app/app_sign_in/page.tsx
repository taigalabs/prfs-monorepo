import React, { Suspense } from "react";

import styles from "./page.module.scss";
import { DefaultLayout, DefaultBody } from "@/components/layouts/default_layout/DefaultLayout";
import AppSignIn from "@/components/app_sign_in/AppSignIn";
import CommitHash from "@/components/commit_hash/CommitHash";

const AppSignInPage = () => {
  return (
    <DefaultLayout>
      <DefaultBody>
        <Suspense>
          <AppSignIn />
        </Suspense>
      </DefaultBody>
      <CommitHash />
    </DefaultLayout>
  );
};

export default AppSignInPage;
