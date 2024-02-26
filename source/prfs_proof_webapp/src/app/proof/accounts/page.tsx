import React, { Suspense } from "react";

import styles from "./page.module.scss";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import Accounts from "@/components/accounts/Accounts";
import SignInLayout, { SignInBody } from "@/components/layouts/sign_in_layout/SignInLayout";
import { PRFS_PROOF } from "@/app_id";
import GlobalErrorDialog from "@/components/global_error_dialog/GlobalErrorDialog";

const AccountsPage = () => {
  return (
    <SignInLayout>
      <GlobalErrorDialog />
      <SignInBody>
        <Suspense>
          <Accounts appId={PRFS_PROOF} />
        </Suspense>
      </SignInBody>
      <div className={styles.footer}>
        <GlobalFooter transparent />
      </div>
    </SignInLayout>
  );
};

export default AccountsPage;
