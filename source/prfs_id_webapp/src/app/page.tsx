import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import SearchProofTypeForm from "@/components/search_proof_type_form/SearchProofTypeForm";
import SearchProofTypeFormFallback from "@/components/search_proof_type_form/SearchProofTypeFormFallback";
import TutorialPlaceholder from "@/components/tutorial/TutorialPlaceholder";
import HomeMasthead from "@/components/home_masthead/HomeMasthead";
import HomeMastheadFallback from "@/components/home_masthead/HomeMastheadFallback";
import { envs } from "@/envs";

const HomePage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Prfs identity</div>
      <p>
        <span>Launch timestamp </span>
        <span>{envs.NEXT_PUBLIC_LAUNCH_TIMESTAMP}</span>
      </p>
      <p>
        <span>Commit hash </span>
        <span>{envs.NEXT_PUBLIC_GIT_COMMIT_HASH}</span>
      </p>
    </div>
  );
};

export default HomePage;
