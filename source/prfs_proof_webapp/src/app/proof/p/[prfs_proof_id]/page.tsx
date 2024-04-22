import React, { Suspense } from "react";

import ProofDetailView from "@/components/proof_detail_view/ProofDetailView";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";

const PrfsProofPage: React.FC<PrfsProofPageProps> = ({ params }) => {
  return (
    <DefaultLayout>
      <DefaultBody>
        <Suspense>
          <ProofDetailView prfsProofId={params.prfs_proof_id} />;
        </Suspense>
      </DefaultBody>
      <DefaultFooter>
        <GlobalFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default PrfsProofPage;

export interface PrfsProofPageProps {
  params: {
    prfs_proof_id: string;
  };
}
