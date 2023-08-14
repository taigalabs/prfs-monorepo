"use client";

import React from "react";
import Link from "next/link";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { CircuitDriver } from "@taigalabs/prfs-entities/bindings/CircuitDriver";
import { useRouter } from "next/navigation";

import styles from "./Program.module.scss";
import { stateContext } from "@/contexts/state";
import Widget, { WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import Breadcrumb, { BreadcrumbEntry } from "@/components/breadcrumb/Breadcrumb";
import DriverSummary from "@/components/driver_summary/DriverSummary";
import DriverPropsMetaTable from "@/components/driver_props_meta_table/DriverPropsMetaTable";
import CircuitTypeList from "@/components/circuit_type_list/CircuitTypeList";
import { DriverPropertyMeta } from "@taigalabs/prfs-entities/bindings/DriverPropertyMeta";

const Program: React.FC<ProgramProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);
  const router = useRouter();

  useLocalWallet(dispatch);

  const [driver, setDriver] = React.useState<CircuitDriver>();

  React.useEffect(() => {
    prfsApi
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
      <CardRow>
        <Card>
          <Widget>
            <div className={styles.topWidgetTitle}>
              <div className={styles.breadcrumbContainer}>
                <Breadcrumb>
                  <BreadcrumbEntry>
                    <Link href="/drivers">{i18n.drivers}</Link>
                  </BreadcrumbEntry>
                  <BreadcrumbEntry>{params.driver_id}</BreadcrumbEntry>
                </Breadcrumb>
              </div>
              <WidgetLabel>{programSummaryLabel}</WidgetLabel>
            </div>
            <DriverSummary driver={driver} />
          </Widget>
        </Card>
      </CardRow>
      <CardRow>
        <Card>
          <Widget>
            <WidgetHeader>
              <WidgetLabel>{i18n.driver_properties_meta}</WidgetLabel>
            </WidgetHeader>
            <div className={styles.tableWrapper}>
              <DriverPropsMetaTable
                driverPropsMeta={driver?.driver_properties_meta as DriverPropertyMeta[]}
              />
            </div>
          </Widget>
        </Card>
      </CardRow>
      <CardRow>
        <Card>
          <Widget>
            <WidgetHeader>
              <WidgetLabel>{i18n.circuit_types}</WidgetLabel>
            </WidgetHeader>
            <div className={styles.tableWrapper}>
              <CircuitTypeList circuit_types={driver?.circuit_types} />
            </div>
          </Widget>
        </Card>
      </CardRow>
    </DefaultLayout>
  );
};

export default Program;

interface ProgramProps {
  params: {
    driver_id: string;
  };
}
