import React, { Suspense } from "react";

import styles from "./HomePage.module.scss";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import GlobalErrorHeader from "@/components/global_error_header/GlobalErrorHeader";
import Welcome from "@/components/welcome/Welcome";

const AccountWelcomePage: React.FC = () => {
  return (
    <DefaultLayout>
      <Suspense>
        <GlobalErrorHeader />
        <Welcome />
        {/* <AccountWelcomePage */}
      </Suspense>
    </DefaultLayout>
  );
};

export default AccountWelcomePage;
