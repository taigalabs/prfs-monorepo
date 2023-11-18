import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import Masthead from "@/components/masthead/Masthead";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import Tutorial from "@/components/tutorial/Tutorial";
import SearchProofTypeForm from "@/components/search_proof_type_form/SearchProofTypeForm";
import TutorialFallback from "@/components/tutorial/TutorialFallback";
import MastheadFallback from "@/components/masthead/MastheadFallback";
import SearchProofTypeFormFallback from "@/components/search_proof_type_form/SearchProofTypeFormFallback";
import AuthList from "@/components/auth_list/AuthList";

const AuthPage = () => {
  return (
    <DefaultLayout>
      <DefaultBody noTopPadding noMinWidth>
        <div className={styles.container}>
          {/* <Suspense fallback={<TutorialFallback />}> */}
          {/*   <Tutorial /> */}
          {/* </Suspense> */}
          <Suspense fallback={<MastheadFallback />}>
            <Masthead />
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

export default AuthPage;
