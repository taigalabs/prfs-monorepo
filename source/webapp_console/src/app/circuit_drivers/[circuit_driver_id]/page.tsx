"use client";

import React from "react";
import Link from "next/link";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { PrfsCircuitDriver } from "@taigalabs/prfs-entities/bindings/PrfsCircuitDriver";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";
import { DriverPropertyMeta } from "@taigalabs/prfs-entities/bindings/DriverPropertyMeta";

import styles from "./Program.module.scss";
import { WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/i18n/context";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import DriverPropsMetaTable from "@/components/driver_props_meta_table/DriverPropsMetaTable";
import { paths } from "@/paths";
import { ContentAreaHeader, ContentAreaRow } from "@/components/content_area/ContentArea";
import DriverDetailTable from "@/components/driver_detail_table/DriverDetailTable";
import SupportingCircuitTypeTable from "@/components/supporting_circuit_type_table/SupportingCircuitTypeTable";
import { useAppDispatch } from "@/state/hooks";

const Program: React.FC<ProgramProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const [driver, setDriver] = React.useState<PrfsCircuitDriver>();

  const dispatch = useAppDispatch();
  useLocalWallet(dispatch);

  React.useEffect(() => {
    async function fn() {
      const { payload } = await prfsApi2("get_prfs_circuit_driver_by_driver_id", {
        circuit_driver_id: params.circuit_driver_id,
      });

      if (payload) {
        setDriver(payload.prfs_circuit_driver);
      }
    }

    fn().then();
  }, [setDriver]);

  let programSummaryLabel = `${i18n.driver_summary_label} ${params.circuit_driver_id}`;

  return (
    <DefaultLayout>
      <ContentAreaHeader>
        <div className={styles.navigation}>
          <Link href={paths.circuit_drivers}>
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
            <SupportingCircuitTypeTable circuit_type_ids={driver?.circuit_type_ids} />
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
