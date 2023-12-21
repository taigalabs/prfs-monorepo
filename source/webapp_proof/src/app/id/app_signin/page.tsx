import React, { Suspense } from "react";

import styles from "./page.module.scss";
import SignInLayout, { SignInBody } from "@/components/layouts/sign_in_layout/SignInLayout";
import PrfsIdAppSignIn from "@/components/prfs_id/prfs_id_app_sign_in/PrfsIdAppSignIn";

const AppSignInPage = () => {
  return (
    <SignInLayout>
      <SignInBody>
        <Suspense>
          <PrfsIdAppSignIn />
        </Suspense>
      </SignInBody>
    </SignInLayout>
  );
};

export default AppSignInPage;
