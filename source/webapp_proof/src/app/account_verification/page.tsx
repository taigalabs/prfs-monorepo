import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import AccountVerification from "@/components/account_verfication/AccountVerification";

const AccountVerificationPage = () => {
  return (
    <DefaultLayout>
      <DefaultBody noMinWidth>
        <Suspense>
          <AccountVerification />
        </Suspense>
      </DefaultBody>
      <DefaultFooter>
        <GlobalFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default AccountVerificationPage;
