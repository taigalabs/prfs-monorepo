import React, { Suspense } from "react";

import styles from "./HomePage.module.scss";
import SignIn from "@/components/sign_in/SignIn";
import SignInLayout from "@/components/layouts/sign_in_layout/SignInLayout";
import GlobalMsgHeader from "@/components/global_msg_header/GlobalMsgHeader";

const SignInPage: React.FC = () => {
  return (
    <SignInLayout>
      <Suspense>
        <GlobalMsgHeader />
        <SignIn />
      </Suspense>
    </SignInLayout>
  );
};

export default SignInPage;
