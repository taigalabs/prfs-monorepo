import React, { Suspense } from "react";

import styles from "./page.module.scss";
import SignInLayout, { SignInBody } from "@/components/layouts/sign_in_layout/SignInLayout";
import PrfsIdCreateID from "@/components/prfs_id_create_id/PrfsIdCreateID";

const IdCreatePage = () => {
  return (
    <SignInLayout>
      <SignInBody>
        <Suspense>
          <PrfsIdCreateID />
        </Suspense>
      </SignInBody>
    </SignInLayout>
  );
};

export default IdCreatePage;
