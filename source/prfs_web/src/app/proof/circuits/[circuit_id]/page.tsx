"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PrfsCircuitSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsCircuitSyn1";
import { RawCircuitInputMeta } from "@taigalabs/prfs-entities/bindings/RawCircuitInputMeta";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";

import styles from "./Circuit.module.scss";
import { stateContext } from "@/contexts/state";
import Widget, { WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import { paths } from "@/paths";
import DriverPropsTable from "@/components/driver_props_table/DriverPropsTable";
import RawCircuitInputMetaTable from "@/components/raw_circuit_input_meta_table/RawCircuitInputMetaTable";
import { CircuitInputMeta } from "@taigalabs/prfs-entities/bindings/CircuitInputMeta";
import { ContentAreaHeader, ContentAreaRow } from "@/components/content_area/ContentArea";
import CircuitDetailTable from "@/components/circuit_detail_table/CircuitDetailTable";
import CircuitInputsMetaTable from "@/components/circuit_inputs_meta_table/CircuitInputsMetaTable";

const Circuit: React.FC<CircuitProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);
  const router = useRouter();
  const [circuit, setCircuit] = React.useState<PrfsCircuitSyn1>();

  useLocalWallet(dispatch);

  const topWidgetLabel = `${i18n.circuit_summary_label} ${params.circuit_id}`;

  React.useEffect(() => {
    async function fn() {
      try {
        const { payload } = await prfsApi.getPrfsCircuitByCircuitId({
          circuit_id: params.circuit_id,
        });

        setCircuit(payload.prfs_circuit_syn1);
      } catch (err) {
        console.error(err);
      }
    }

    fn().then();
  }, [setCircuit]);

  return (
    <DefaultLayout>
      <ContentAreaHeader>
        <Link href={paths.proof__circuits}>
          <ArrowButton variant="left" />
        </Link>
        <WidgetLabel>{topWidgetLabel}</WidgetLabel>
      </ContentAreaHeader>

      <div className={styles.contentBody}>
        <ContentAreaRow>
          <div className={styles.singleColRow}>
            <CircuitDetailTable circuit={circuit} />
          </div>
        </ContentAreaRow>

        {circuit && (
          <ContentAreaRow>
            <div className={styles.singleColRow}>
              <div className={styles.tableTitle}>
                {i18n.driver_properties} ({circuit.circuit_driver_id})
              </div>
              <DriverPropsTable driver_properties={circuit.driver_properties} />
            </div>
          </ContentAreaRow>
        )}

        {circuit && (
          <ContentAreaRow>
            <div className={styles.singleColRow}>
              <div className={styles.tableTitle}>{i18n.circuit_inputs}</div>
              <CircuitInputsMetaTable
                circuit_inputs_meta={circuit.circuit_inputs_meta as CircuitInputMeta[]}
              />
            </div>
          </ContentAreaRow>
        )}

        {circuit && (
          <ContentAreaRow>
            <div className={styles.singleColRow}>
              <div className={styles.tableTitle}>{i18n.raw_circuit_inputs}</div>
              <RawCircuitInputMetaTable
                raw_circuit_inputs_meta={circuit.raw_circuit_inputs_meta as RawCircuitInputMeta[]}
              />
            </div>
          </ContentAreaRow>
        )}
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
