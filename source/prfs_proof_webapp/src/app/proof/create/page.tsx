import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import CreateProofForm from "@/components/create_proof_form/CreateProofForm";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import TutorialPlaceholder from "@/components/tutorial/TutorialPlaceholder";

const CreatePage = () => {
  return (
    <DefaultLayout>
      <DefaultBody>
        <Suspense>
          <CreateProofForm />
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

export default CreatePage;
