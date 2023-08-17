"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import * as prfsApi from "@taigalabs/prfs-api-js";

import styles from "./ProofInstancePage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { TopWidgetTitle, WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { stateContext } from "@/contexts/state";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import ProofInstanceTable from "@/components/proof_instance_table/ProofInstanceTable";
import CreateProofInstanceForm from "@/components/create_proof_instance_form/CreateProofInstanceForm";
import { PaddedTableWrapper } from "@/components/table/Table";
import { PrfsProofInstance } from "@taigalabs/prfs-entities/bindings/PrfsProofInstance";

const ProofInstancePage: React.FC<ProofInstancePageProps> = ({ params }) => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);
  const router = useRouter();

  useLocalWallet(dispatch);

  const [proofInstance, setProofInstance] = React.useState<PrfsProofInstance>();
  React.useEffect(() => {
    const proof_instance_id = decodeURIComponent(params.proof_instance_id);

    prfsApi
      .getPrfsProofInstances({
        page: 0,
        proof_instance_id,
      })
      .then(resp => {
        const { prfs_proof_instances } = resp.payload;

        if (prfs_proof_instances.length > 0) {
          setProofInstance(prfs_proof_instances[0]);
        } else {
          // router.push("/proofs");
        }
      });
  }, [setProofInstance]);

  // const proofTypeSummaryLabel = `${i18n.proof_type_summary_label} ${params.proof_type_id}`;

  // const handleClickCreateProofType = React.useCallback(() => {
  //   router.push("/proofs?create");
  // }, [router]);
  //
  console.log(111, proofInstance);

  return (
    <DefaultLayout>
      <div>555</div>
    </DefaultLayout>
  );
};

export default ProofInstancePage;

interface ProofInstancePageProps {
  params: {
    proof_instance_id: string;
  };
}
