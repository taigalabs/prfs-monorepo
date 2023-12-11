import React, { Suspense } from "react";

import styles from "./page.module.scss";
import SignInLayout, { SignInBody } from "@/components/layouts/sign_in_layout/SignInLayout";
import CreateID from "@/components/create_id/CreateID";

const AccountCreatePage = () => {
  return (
    <SignInLayout>
      <SignInBody>
        <Suspense>
          <CreateID />
        </Suspense>
      </SignInBody>
    </SignInLayout>
  );
};

export default AccountCreatePage;
