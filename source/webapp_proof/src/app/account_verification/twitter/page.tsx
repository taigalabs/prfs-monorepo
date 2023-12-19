import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import TwitterAccVerification from "@/components/twitter_acc_verification/TwitterAccVerification";

const TwitterVerificationPage = () => {
  return (
    <DefaultLayout>
      <DefaultBody noMinWidth>
        <Suspense>
          <TwitterAccVerification />
        </Suspense>
      </DefaultBody>
      <DefaultFooter>
        <GlobalFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default TwitterVerificationPage;
