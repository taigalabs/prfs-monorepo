import React, { Suspense } from "react";

import styles from "./HomePage.module.scss";
import SignIn from "@/components/sign_in/SignIn";
import SignInLayout from "@/components/layouts/sign_in_layout/SignInLayout";
import GlobalErrorHeader from "@/components/global_error_header/GlobalErrorHeader";

const SignInPage: React.FC = () => {
  return (
    <SignInLayout>
      <Suspense>
        <GlobalErrorHeader />
        <SignIn />
      </Suspense>
    </SignInLayout>
  );
};

export default SignInPage;
