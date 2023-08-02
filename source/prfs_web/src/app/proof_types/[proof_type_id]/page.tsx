"use client";

import React from "react";
import Link from "next/link";

import styles from "./ProofType.module.scss";
import { stateContext } from "@/contexts/state";
import Widget, { WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import Breadcrumb, { BreadcrumbEntry } from "@/components/breadcrumb/Breadcrumb";
import * as prfsBackend from "@/fetch/prfsBackend";
import { PrfsCircuit, PrfsCircuitProgram, PrfsProofType } from "@/models/index";
import { useRouter } from "next/navigation";
import CircuitSummary from "@/components/circuit_summary/CircuitSummary";
import PublicInputTable from "@/components/public_input_table/PublicInputTable";
import CircuitProgramSummary from "@/components/circuit_program_summary/CircuitProgramSummary";

const Program: React.FC<ProgramProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);
  const router = useRouter();

  const [proofType, setProofType] = React.useState<PrfsProofType>();
  React.useEffect(() => {
    prfsBackend
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

  console.log(11, proofType);

  return (
    <DefaultLayout>
      <Breadcrumb>
        <BreadcrumbEntry>
          <Link href="/programs">{i18n.programs}</Link>
        </BreadcrumbEntry>
        <BreadcrumbEntry>{params.proof_type_id}</BreadcrumbEntry>
      </Breadcrumb>
      <div className={styles.contentArea}>
        <CardRow>
          <Card>
            <Widget>
              <WidgetHeader>
                <WidgetLabel>{i18n.programs}</WidgetLabel>
              </WidgetHeader>
              {/* <CircuitProgramSummary program={program} /> */}
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
