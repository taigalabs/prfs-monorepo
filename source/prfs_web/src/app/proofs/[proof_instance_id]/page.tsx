"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import * as prfsApi from "@taigalabs/prfs-api-js";
import Link from "next/link";

import styles from "./ProofInstancePage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, {
  TopWidgetTitle,
  WidgetHeader,
  WidgetLabel,
  WidgetPaddedBody,
} from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { stateContext } from "@/contexts/state";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import ProofInstanceTable from "@/components/proof_instance_table/ProofInstanceTable";
import CreateProofInstanceForm from "@/components/create_proof_instance_form/CreateProofInstanceForm";
import { PaddedTableWrapper } from "@/components/table/Table";
import { PrfsProofInstance } from "@taigalabs/prfs-entities/bindings/PrfsProofInstance";
import ProofInstanceDetailTable from "@/components/proof_instance_detail_table/ProofInstanceDetailTable";
import Breadcrumb, { BreadcrumbEntry } from "@/components/breadcrumb/Breadcrumb";
import { PaddedSummaryWrapper } from "@/components/columnal_summary/ColumnarSummary";

const ProofInstancePage: React.FC<ProofInstancePageProps> = ({ params }) => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);
  const router = useRouter();

  useLocalWallet(dispatch);

  const topWidgetLabel = `${i18n.circuit_summary_label} ${params.proof_instance_id}`;

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

  console.log(111, proofInstance);

  return (
    <DefaultLayout>
      <CardRow>
        <Card>
          <Widget>
            <TopWidgetTitle>
              <div className={styles.header}>
                <div className={styles.breadcrumbContainer}>
                  <Breadcrumb>
                    <BreadcrumbEntry>
                      <Link href="/proofs">{i18n.proofs}</Link>
                    </BreadcrumbEntry>
                    <BreadcrumbEntry>{params.proof_instance_id}</BreadcrumbEntry>
                  </Breadcrumb>
                </div>
                <WidgetLabel>{topWidgetLabel}</WidgetLabel>
              </div>
            </TopWidgetTitle>
            <div className={styles.proofInstanceDetailTableContainer}>
              {proofInstance && <ProofInstanceDetailTable proofInstance={proofInstance} />}
            </div>
          </Widget>
        </Card>
      </CardRow>
    </DefaultLayout>
  );
};

export default ProofInstancePage;

interface ProofInstancePageProps {
  params: {
    proof_instance_id: string;
  };
}
