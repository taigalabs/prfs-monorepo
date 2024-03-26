import React, { Suspense } from "react";

import styles from "./page.module.scss";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import ProofDetailView from "@/components/proof_detail_view/ProofDetailView";

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
