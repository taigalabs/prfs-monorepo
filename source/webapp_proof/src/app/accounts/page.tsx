import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import Accounts from "@/components/accounts/Accounts";
import SignInLayout, { SignInBody } from "@/components/layouts/sign_in_layout/SignInLayout";

const AccountsPage = () => {
  return (
    <SignInLayout>
      <SignInBody>
        <Suspense>
          <Accounts />
        </Suspense>
      </SignInBody>
      <div className={styles.footer}>
        <GlobalFooter transparent />
      </div>
    </SignInLayout>
  );
};

export default AccountsPage;
