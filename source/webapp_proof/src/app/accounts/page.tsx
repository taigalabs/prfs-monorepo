import React, { Suspense } from "react";

import styles from "./page.module.scss";
import IdLayout, { IdBody } from "@/components/layouts/id_layout/IdLayout";
import SignIn from "@/components/sign_in/SignIn";

const AccountsPage = () => {
  return (
    <IdLayout>
      <IdBody>
        <Suspense>
          <SignIn />
        </Suspense>
      </IdBody>
    </IdLayout>
  );
};

export default AccountsPage;
