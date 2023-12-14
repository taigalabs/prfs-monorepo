import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import Masthead from "@/components/masthead/Masthead";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import MastheadFallback from "@/components/masthead/MastheadFallback";
import AuthList from "@/components/auth_list/AuthList";
import ProofTypeMasthead from "@/components/masthead/ProofTypeMasthead";

const AccountVerificationPage = () => {
  return (
    <DefaultLayout>
      <DefaultBody noTopPadding noMinWidth>
        <div className={styles.container}>
          <Suspense>
            <ProofTypeMasthead
              proofInstanceId={undefined}
              proofType={undefined}
              handleSelectProofType={() => {}}
            />
          </Suspense>
          <Suspense>
            <AuthList />
          </Suspense>
        </div>
      </DefaultBody>
      <DefaultFooter>
        <GlobalFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default AccountVerificationPage;
