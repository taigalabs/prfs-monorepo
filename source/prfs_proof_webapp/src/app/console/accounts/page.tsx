import React, { Suspense } from "react";

import styles from "./page.module.scss";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import Accounts from "@/components/accounts/Accounts";
import SignInLayout, { SignInBody } from "@/components/layouts/sign_in_layout/SignInLayout";
import { PRFS_CONSOLE_APP_ID } from "@/app_id";

const AccountsPage = () => {
  return (
    <SignInLayout>
      <SignInBody>
        <Suspense>
          <Accounts appId={PRFS_CONSOLE_APP_ID} />
        </Suspense>
      </SignInBody>
      <div className={styles.footer}>
        <GlobalFooter transparent />
      </div>
    </SignInLayout>
  );
};

export default AccountsPage;
