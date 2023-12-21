import React, { Suspense } from "react";

import styles from "./page.module.scss";
import SignInLayout, { SignInBody } from "@/components/layouts/sign_in_layout/SignInLayout";
import PrfsIdSignIn from "@/components/prfs_id_sign_in/PrfsIdSignIn";

const AppSignInPage = () => {
  return (
    <SignInLayout>
      <SignInBody>
        <Suspense>
          <PrfsIdSignIn />
        </Suspense>
      </SignInBody>
    </SignInLayout>
  );
};

export default AppSignInPage;
