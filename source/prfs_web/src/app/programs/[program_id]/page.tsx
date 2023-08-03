"use client";

import React from "react";
import Link from "next/link";

import styles from "./Program.module.scss";
import { stateContext } from "@/contexts/state";
import Widget, { WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import Breadcrumb, { BreadcrumbEntry } from "@/components/breadcrumb/Breadcrumb";
import * as prfsBackend from "@/fetch/prfsBackend";
import { PrfsCircuitProgram } from "@/models/index";
import { useRouter } from "next/navigation";
import CircuitProgramSummary from "@/components/circuit_program_summary/CircuitProgramSummary";
import CircuitProgramPropsTable from "@/components/circuit_pgm_props_table/CircuitProgramPropsTable";

const Program: React.FC<ProgramProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);
  const router = useRouter();

  const [program, setProgram] = React.useState<PrfsCircuitProgram>();
  React.useEffect(() => {
    prfsBackend
      .getPrfsNativeCircuitPrograms({
        page: 0,
        program_id: params.program_id,
      })
      .then(resp => {
        const { prfs_circuit_programs } = resp.payload;

        if (prfs_circuit_programs.length > 0) {
          setProgram(prfs_circuit_programs[0]);
        } else {
          router.push("/programs");
        }
      });
  }, [setProgram]);

  let programSummaryLabel = `${i18n.program_summary_label} ${params.program_id}`;

  return (
    <DefaultLayout>
      <Breadcrumb>
        <BreadcrumbEntry>
          <Link href="/programs">{i18n.programs}</Link>
        </BreadcrumbEntry>
        <BreadcrumbEntry>{params.program_id}</BreadcrumbEntry>
      </Breadcrumb>
      <div className={styles.contentArea}>
        <CardRow>
          <Card>
            <Widget>
              <WidgetHeader>
                <WidgetLabel>{programSummaryLabel}</WidgetLabel>
              </WidgetHeader>
              <CircuitProgramSummary program={program} />
            </Widget>
          </Card>
        </CardRow>
        <CardRow>
          <Card>
            <Widget>
              <WidgetHeader>
                <WidgetLabel>{i18n.program_properties}</WidgetLabel>
              </WidgetHeader>
              <CircuitProgramPropsTable program={program} />
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
    program_id: string;
  };
}
