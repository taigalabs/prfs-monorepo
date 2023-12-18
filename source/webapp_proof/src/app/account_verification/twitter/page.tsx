import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import Masthead from "@/components/masthead/Masthead";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import MastheadFallback from "@/components/masthead/MastheadFallback";
import TwitterAuth from "@/components/twitter_auth/TwitterAuth";

const TwitterPage = () => {
  return (
    <DefaultLayout>
      <DefaultBody noMinWidth>
        <div className={styles.container}>
          <Suspense fallback={<MastheadFallback />}>
            <Masthead />
          </Suspense>
          <Suspense>
            <TwitterAuth />
          </Suspense>
        </div>
      </DefaultBody>
      <DefaultFooter>
        <GlobalFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default TwitterPage;
