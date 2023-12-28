import React, { Suspense } from "react";

import styles from "./HomePage.module.scss";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import Account from "@/components/account/Account";

const AccountsPage: React.FC = () => {
  return (
    <DefaultLayout>
      <Suspense>
        <Account />
      </Suspense>
    </DefaultLayout>
  );
};

export default AccountsPage;
