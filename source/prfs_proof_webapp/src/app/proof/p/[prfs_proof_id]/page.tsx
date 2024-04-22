import React from "react";
import { redirect } from "next/navigation";

import { paths } from "@/paths";
import ProofDetailView from "@/components/proof_detail_view/ProofDetailView";

const PrfsProofPage: React.FC<PrfsProofPageProps> = ({ params }) => {
  return <ProofDetailView prfs_proof_id={params.prfs_proof_id} />;
};

export default PrfsProofPage;

export interface PrfsProofPageProps {
  params: {
    prfs_proof_id: string;
  };
}
