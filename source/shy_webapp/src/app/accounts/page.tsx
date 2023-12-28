import React, { Suspense } from "react";

import styles from "./HomePage.module.scss";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import Home from "@/components/home/Home";

const AccountsPage: React.FC = () => {
  return (
    <DefaultLayout>
      <Suspense>
        accounts
        {/* <Home /> */}
      </Suspense>
    </DefaultLayout>
  );
};

export default AccountsPage;
