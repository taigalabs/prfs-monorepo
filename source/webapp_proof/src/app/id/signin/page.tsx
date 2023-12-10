import React, { Suspense } from "react";

import styles from "./page.module.scss";
import SignInLayout, { SignInBody } from "@/components/layouts/sign_in_layout/SignInLayout";
import SignIn from "@/components/sign_in/SignIn";

const AccountsSignInPage = () => {
  return (
    <SignInLayout>
      <SignInBody>
        <Suspense>
          <SignIn />
        </Suspense>
      </SignInBody>
    </SignInLayout>
  );
};

export default AccountsSignInPage;
