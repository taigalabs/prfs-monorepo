import React, { Suspense } from "react";

import styles from "./HomePage.module.scss";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import Account from "@/components/account/Account";

const AccountWelcomePage: React.FC = () => {
  return (
    <DefaultLayout>
      <Suspense>
        welcome
        <Account />
      </Suspense>
    </DefaultLayout>
  );
};

export default AccountWelcomePage;
