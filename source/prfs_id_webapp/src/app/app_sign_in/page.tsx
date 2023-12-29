import React, { Suspense } from "react";

import styles from "./page.module.scss";
<<<<<<< HEAD
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
=======
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
>>>>>>> main
  );
};

export default AppSignInPage;
