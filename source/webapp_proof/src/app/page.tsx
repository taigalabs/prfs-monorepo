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

const HomePage = () => {
  return (
    <DefaultLayout>
      <DefaultBody noTopPadding>
        <div className={styles.container}>
          <Suspense fallback={<TutorialFallback />}>
            <Tutorial />
          </Suspense>
          <Suspense fallback={<MastheadFallback />}>
            <Masthead />
          </Suspense>
          <Suspense fallback={<div>fallback2</div>}>
            <SearchProofTypeForm />
          </Suspense>
        </div>
      </DefaultBody>
      {/* <DefaultFooter> */}
      {/*   <GlobalFooter /> */}
      {/* </DefaultFooter> */}
    </DefaultLayout>
  );
};

export default HomePage;
