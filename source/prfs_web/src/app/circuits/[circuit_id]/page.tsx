"use client";

import React from "react";
import Link from "next/link";

import styles from "./Circuit.module.scss";
import { stateContext } from "@/contexts/state";
import Widget, { WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import Breadcrumb, { BreadcrumbEntry } from "@/components/breadcrumb/Breadcrumb";
import * as prfsBackend from "@/fetch/prfsBackend";
import { PrfsCircuit } from "@/models/index";
import { useRouter } from "next/navigation";
import CircuitSummary from "@/components/circuit_summary/CircuitSummary";
import CircuitProgramSummary from "@/components/circuit_program_summary/CircuitProgramSummary";
import PublicInputTable from "@/components/public_input_table/PublicInputTable";

const Circuit: React.FC<CircuitProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);
  const router = useRouter();

  const [circuit, setCircuit] = React.useState<PrfsCircuit>();
  React.useEffect(() => {
    prfsBackend
      .getPrfsNativeCircuits({
        page: 0,
        circuit_id: params.circuit_id,
      })
      .then(resp => {
        const { prfs_circuits } = resp.payload;

        if (prfs_circuits.length > 0) {
          setCircuit(prfs_circuits[0]);
        } else {
          router.push("/circuits");
        }
      });
  }, [setCircuit]);

  return (
    <DefaultLayout>
      <Breadcrumb>
        <BreadcrumbEntry>
          <Link href="/circuits">{i18n.circuits}</Link>
        </BreadcrumbEntry>
        <BreadcrumbEntry>{params.circuit_id}</BreadcrumbEntry>
      </Breadcrumb>
      <div className={styles.contentArea}>
        <CardRow>
          <Card>
            <Widget>
              <WidgetHeader>
                <WidgetLabel>{`${i18n.circuit} - ${params.circuit_id}`}</WidgetLabel>
              </WidgetHeader>
              <CircuitSummary circuit={circuit} />
            </Widget>
            <div className={styles.secondRowWidget}>
              <Widget>
                <WidgetHeader>
                  <WidgetLabel>{i18n.program}</WidgetLabel>
                </WidgetHeader>
                <CircuitProgramSummary circuit={circuit} />
              </Widget>
            </div>
          </Card>
        </CardRow>
        <CardRow>
          <Card>
            <Widget>
              <WidgetHeader>
                <WidgetLabel>{i18n.public_inputs}</WidgetLabel>
              </WidgetHeader>
              <PublicInputTable circuit={circuit} />
            </Widget>
          </Card>
        </CardRow>
      </div>
    </DefaultLayout>
  );
};

export default Circuit;

interface CircuitProps {
  params: {
    circuit_id: string;
  };
}
