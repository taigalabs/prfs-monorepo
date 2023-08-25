"use client";

import React from "react";
import Link from "next/link";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PrfsCircuitDriver } from "@taigalabs/prfs-entities/bindings/PrfsCircuitDriver";
import { useRouter } from "next/navigation";
import { PaddedTableWrapper } from "@taigalabs/prfs-react-components/src/table/Table";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";
import { DriverPropertyMeta } from "@taigalabs/prfs-entities/bindings/DriverPropertyMeta";

import styles from "./Program.module.scss";
import { stateContext } from "@/contexts/state";
import Widget, { TopWidgetTitle, WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import DriverPropsMetaTable from "@/components/driver_props_meta_table/DriverPropsMetaTable";
import CircuitTypeList from "@/components/circuit_type_list/CircuitTypeList";
import { PaddedSummaryWrapper } from "@/components/columnal_summary/ColumnarSummary";
import { paths } from "@/paths";
import { ContentAreaHeader, ContentAreaRow } from "@/components/content_area/ContentArea";
import DriverDetailTable from "@/components/driver_detail_table/DriverDetailTable";

const Program: React.FC<ProgramProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);
  const router = useRouter();
  const [driver, setDriver] = React.useState<PrfsCircuitDriver>();

  useLocalWallet(dispatch);

  React.useEffect(() => {
    prfsApi
      .getPrfsNativeCircuitDrivers({
        page: 0,
        circuit_driver_id: params.circuit_driver_id,
      })
      .then(resp => {
        const { prfs_circuit_drivers } = resp.payload;

        if (prfs_circuit_drivers.length > 0) {
          setDriver(prfs_circuit_drivers[0]);
        } else {
          router.push(paths.proof__circuit_drivers);
        }
      });
  }, [setDriver]);

  let programSummaryLabel = `${i18n.driver_summary_label} ${params.circuit_driver_id}`;

  return (
    <DefaultLayout>
      <ContentAreaHeader>
        <div className={styles.navigation}>
          <Link href={paths.proof__circuit_drivers}>
            <ArrowButton variant="left" />
          </Link>
        </div>
        <WidgetLabel>{programSummaryLabel}</WidgetLabel>
      </ContentAreaHeader>

      <div className={styles.contentBody}>
        <ContentAreaRow>
          <div className={styles.singleColRow}>
            <DriverDetailTable driver={driver} />
          </div>
        </ContentAreaRow>

        <ContentAreaRow>
          <div className={styles.singleColRow}>
            <div className={styles.tableTitle}>{i18n.driver_properties_meta}</div>
            <DriverPropsMetaTable
              driverPropsMeta={driver?.driver_properties_meta as DriverPropertyMeta[]}
            />
          </div>
        </ContentAreaRow>

        <ContentAreaRow>
          <div className={styles.singleColRow}>
            <div className={styles.tableTitle}>{i18n.circuit_types}</div>
            <CircuitTypeList circuit_types={driver?.circuit_types} />
          </div>
        </ContentAreaRow>
      </div>
    </DefaultLayout>
  );
};

export default Program;

interface ProgramProps {
  params: {
    circuit_driver_id: string;
  };
}
