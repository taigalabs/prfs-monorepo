import React, { Suspense } from "react";

import styles from "./HomePage.module.scss";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import Welcome from "@/components/welcome/Welcome";
import GlobalMsgHeader from "@/components/global_msg_header/GlobalMsgHeader";

const AccountWelcomePage: React.FC = () => {
  return (
    <DefaultLayout>
      <Suspense>
        <GlobalMsgHeader />
        <Welcome />
      </Suspense>
    </DefaultLayout>
  );
};

export default AccountWelcomePage;
