import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import Attestations from "@/components/attestations/Attestations";
import AttestationsCreate from "@/components/attestions_create/AttestationsCreate";

const AccountsPage = () => {
  return (
    <DefaultLayout>
      <DefaultBody noMinWidth>
        <Suspense>power</Suspense>
      </DefaultBody>
      <DefaultFooter>
        <GlobalFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default AccountsPage;
