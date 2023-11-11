import React, { Suspense } from "react";

import styles from "./page.module.scss";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import ProofDetailView from "@/components/proof_detail_view/ProofDetailView";
import Tutorial from "@/components/tutorial/Tutorial";
import TutorialFallback from "@/components/tutorial/TutorialFallback";

const ProofInstancePage: React.FC<ProofInstancePageProps> = ({ params }) => {
  return (
    <DefaultLayout>
      <DefaultBody noTopPadding>
        <div className={styles.container}>
          <Suspense fallback={<TutorialFallback />}>
            <Tutorial />
          </Suspense>
          <Suspense fallback={<TutorialFallback />}>
            <ProofDetailView proofInstanceId={params.proof_instance_id} />
          </Suspense>
        </div>
      </DefaultBody>
      <DefaultFooter>
        <GlobalFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default ProofInstancePage;

interface ProofInstancePageProps {
  params: {
    proof_instance_id: string;
  };
}
