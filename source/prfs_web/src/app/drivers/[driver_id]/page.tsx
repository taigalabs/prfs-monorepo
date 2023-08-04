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
import { PrfsCircuitDriver } from "@/models/index";
import { useRouter } from "next/navigation";
import CircuitDriverSummary from "@/components/circuit_driver_summary/CircuitDriverSummary";
import CircuitDriverPropsTable from "@/components/circuit_driver_props_table/CircuitDriverPropsTable";

const Program: React.FC<ProgramProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);
  const router = useRouter();

  const [driver, setDriver] = React.useState<PrfsCircuitDriver>();
  React.useEffect(() => {
    prfsBackend
      .getPrfsNativeCircuitDrivers({
        page: 0,
        driver_id: params.driver_id,
      })
      .then(resp => {
        const { prfs_circuit_drivers } = resp.payload;

        if (prfs_circuit_drivers.length > 0) {
          setDriver(prfs_circuit_drivers[0]);
        } else {
          router.push("/programs");
        }
      });
  }, [setDriver]);

  let programSummaryLabel = `${i18n.driver_summary_label} ${params.driver_id}`;

  return (
    <DefaultLayout>
      <Breadcrumb>
        <BreadcrumbEntry>
          <Link href="/drivers">{i18n.drivers}</Link>
        </BreadcrumbEntry>
        <BreadcrumbEntry>{params.driver_id}</BreadcrumbEntry>
      </Breadcrumb>
      <div className={styles.contentArea}>
        <CardRow>
          <Card>
            <Widget>
              <WidgetHeader>
                <WidgetLabel>{programSummaryLabel}</WidgetLabel>
              </WidgetHeader>
              <CircuitDriverSummary driver={driver} />
            </Widget>
          </Card>
        </CardRow>
        <CardRow>
          <Card>
            <Widget>
              <WidgetHeader>
                <WidgetLabel>{i18n.driver_properties}</WidgetLabel>
              </WidgetHeader>
              <CircuitDriverPropsTable driver={driver} />
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
    driver_id: string;
  };
}
