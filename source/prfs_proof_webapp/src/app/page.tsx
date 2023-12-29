import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import SearchProofTypeForm from "@/components/search_proof_type_form/SearchProofTypeForm";
import TutorialPlaceholder from "@/components/tutorial/TutorialPlaceholder";
import HomeMasthead from "@/components/home_masthead/HomeMasthead";
import HomeMastheadFallback from "@/components/home_masthead/HomeMastheadFallback";

const HomePage = () => {
  return (
    <DefaultLayout>
      <DefaultBody noMinWidth>
        <Suspense fallback={<HomeMastheadFallback />}>
          <HomeMasthead />
        </Suspense>
        <Suspense>
          <SearchProofTypeForm />
        </Suspense>
      </DefaultBody>
      <DefaultFooter>
        <GlobalFooter />
        <Suspense>
          <TutorialPlaceholder />
        </Suspense>
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default HomePage;
