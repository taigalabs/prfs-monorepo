import React, { Suspense } from "react";

import styles from "./page.module.scss";
import SignInLayout, { SignInBody } from "@/components/layouts/sign_in_layout/SignInLayout";
import PrfsSignIn from "@/components/prfs_sign_in/PrfsSignIn";

const AccountCreatePage = () => {
  return (
    <SignInLayout>
      <SignInBody>
        <Suspense>
          <PrfsSignIn />
        </Suspense>
      </SignInBody>
    </SignInLayout>
  );
};

export default AccountCreatePage;
