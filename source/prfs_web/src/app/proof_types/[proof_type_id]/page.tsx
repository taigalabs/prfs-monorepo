"use client";

import React from "react";
import Link from "next/link";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";

import styles from "./ProofType.module.scss";
import { stateContext } from "@/contexts/state";
import Widget, { WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import Breadcrumb, { BreadcrumbEntry } from "@/components/breadcrumb/Breadcrumb";
import { useRouter } from "next/navigation";
import CircuitInputTable from "@/components/circuit_input_table/CircuitInputTable";
import ProofTypeSummary from "@/components/proof_type_summary/ProofTypeSummary";

const Program: React.FC<ProgramProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);
  const router = useRouter();

  const [proofType, setProofType] = React.useState<PrfsProofType>();
  React.useEffect(() => {
    prfsApi
      .getPrfsProofTypes({
        page: 0,
        proof_type_id: params.proof_type_id,
      })
      .then(resp => {
        const { prfs_proof_types } = resp.payload;

        if (prfs_proof_types.length > 0) {
          setProofType(prfs_proof_types[0]);
        } else {
          router.push("/programs");
        }
      });
  }, [setProofType]);

  const proofTypeSummaryLabel = `${i18n.proof_type_summary_label} ${params.proof_type_id}`;

  return (
    <DefaultLayout>
      <Breadcrumb>
        <BreadcrumbEntry>
          <Link href="/proof_types">{i18n.proof_types}</Link>
        </BreadcrumbEntry>
        <BreadcrumbEntry>{params.proof_type_id}</BreadcrumbEntry>
      </Breadcrumb>
      <div className={styles.contentArea}>
        <CardRow>
          <Card>
            <Widget>
              <WidgetHeader>
                <WidgetLabel>{proofTypeSummaryLabel}</WidgetLabel>
              </WidgetHeader>
              <ProofTypeSummary proofType={proofType} />
            </Widget>
          </Card>
        </CardRow>
        <CardRow>
          <Card>
            <Widget>
              <WidgetHeader>
                <WidgetLabel>{i18n.public_input_instance}</WidgetLabel>
              </WidgetHeader>
              {proofType && <CircuitInputTable circuit_inputs={proofType.circuit_inputs} />}
            </Widget>
          </Card>
        </CardRow>
      </div>
    </DefaultLayout>
  );
};

export default Program;

interface ProgramProps {
  params: {
    proof_type_id: string;
  };
}
