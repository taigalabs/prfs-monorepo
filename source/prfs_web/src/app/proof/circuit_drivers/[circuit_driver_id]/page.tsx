"use client";

import React from "react";
import Link from "next/link";
// import * as prfsApi from "@taigalabs/prfs-api-js";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { PrfsCircuitDriver } from "@taigalabs/prfs-entities/bindings/PrfsCircuitDriver";
import { useRouter } from "next/navigation";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";
import { DriverPropertyMeta } from "@taigalabs/prfs-entities/bindings/DriverPropertyMeta";

import styles from "./Program.module.scss";
import { stateContext } from "@/contexts/state";
import { WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import DriverPropsMetaTable from "@/components/driver_props_meta_table/DriverPropsMetaTable";
import { paths } from "@/paths";
import { ContentAreaHeader, ContentAreaRow } from "@/components/content_area/ContentArea";
import DriverDetailTable from "@/components/driver_detail_table/DriverDetailTable";
import SupportingCircuitTypeTable from "@/components/supporting_circuit_type_table/SupportingCircuitTypeTable";

const Program: React.FC<ProgramProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);
  const router = useRouter();
  const [driver, setDriver] = React.useState<PrfsCircuitDriver>();

  useLocalWallet(dispatch);

  React.useEffect(() => {
    async function fn() {
      // const { payload } = await prfsApi.getPrfsCircuitDriverByDriverId({
      //   circuit_driver_id: params.circuit_driver_id,
      // });

      const { payload } = await prfsApi2("get_prfs_circuit_driver_by_driver_id", {
        circuit_driver_id: params.circuit_driver_id,
      });

      setDriver(payload.prfs_circuit_driver);
    }

    fn().then();
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
            <SupportingCircuitTypeTable circuit_types={driver?.circuit_types} />
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
