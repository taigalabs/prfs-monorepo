import React, { Suspense } from "react";

import styles from "./HomePage.module.scss";
import SignIn from "@/components/signin/SignIn";
import SignInLayout from "@/components/layouts/sign_in_layout/SignInLayout";

const SignInPage: React.FC = () => {
  return (
    <SignInLayout>
      <Suspense>
        <SignIn />
      </Suspense>
    </SignInLayout>
  );
};

export default SignInPage;
