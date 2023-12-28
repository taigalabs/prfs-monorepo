import React, { Suspense } from "react";

import styles from "./HomePage.module.scss";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import Home from "@/components/home/Home";

const SignInPage: React.FC = () => {
  return (
    <DefaultLayout>
      <Suspense>
        sign in
        {/* <Home /> */}
      </Suspense>
    </DefaultLayout>
  );
};

export default SignInPage;
