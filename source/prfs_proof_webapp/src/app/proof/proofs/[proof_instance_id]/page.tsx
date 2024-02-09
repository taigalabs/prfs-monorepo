import React, { Suspense } from "react";

import styles from "./page.module.scss";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import ProofDetailView from "@/components/proof_detail_view/ProofDetailView";
import TutorialPlaceholder from "@/components/tutorial/TutorialPlaceholder";

const ProofInstancePage: React.FC<ProofInstancePageProps> = ({ params }) => {
  return (
    <DefaultLayout>
      <DefaultBody>
        <Suspense>
          <ProofDetailView proofInstanceId={params.proof_instance_id} />
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

export default ProofInstancePage;

interface ProofInstancePageProps {
  params: {
    proof_instance_id: string;
  };
}
