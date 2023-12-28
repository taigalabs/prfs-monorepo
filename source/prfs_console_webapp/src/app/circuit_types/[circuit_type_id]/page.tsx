"use client";

import React from "react";
import Link from "next/link";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { CircuitInputMeta } from "@taigalabs/prfs-entities/bindings/CircuitInputMeta";
import { PrfsCircuitType } from "@taigalabs/prfs-entities/bindings/PrfsCircuitType";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";

import styles from "./CircuitType.module.scss";
import { WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/i18n/context";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import CircuitInputsMetaTable from "@/components/circuit_inputs_meta_table/CircuitInputsMetaTable";
import { paths } from "@/paths";
import { ContentAreaHeader, ContentAreaRow } from "@/components/content_area/ContentArea";
import CircuitTypeDetailTable from "@/components/circuit_type_detail_table/CircuitTypeDetailTable";
import { useAppDispatch } from "@/state/hooks";

const CircuitType: React.FC<CircuitTypeProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const [circuitType, setCircuitType] = React.useState<PrfsCircuitType>();

  const topWidgetLabel = `${i18n.circuit_type} - ${params.circuit_type_id}`;

  const dispatch = useAppDispatch();
  useLocalWallet(dispatch);

  React.useEffect(() => {
    async function fn() {
      const { payload } = await prfsApi2("get_prfs_circuit_type_by_circuit_type_id", {
        circuit_type_id: params.circuit_type_id,
      });

      if (payload) {
        setCircuitType(payload.prfs_circuit_type);
      }
    }

    fn().then();
  }, [setCircuitType]);

  return (
    <DefaultLayout>
      <ContentAreaHeader>
        <div className={styles.navigation}>
          <Link href={paths.circuit_types}>
            <ArrowButton variant="left" />
          </Link>
        </div>
        <WidgetLabel>{topWidgetLabel}</WidgetLabel>
      </ContentAreaHeader>

      <div className={styles.contentBody}>
        <ContentAreaRow>
          <div className={styles.singleColRow}>
            <CircuitTypeDetailTable circuit_type={circuitType} />
          </div>
        </ContentAreaRow>

        {circuitType && (
          <ContentAreaRow>
            <div className={styles.singleColRow}>
              <div className={styles.tableTitle}>
                {i18n.circuit_inputs} ({circuitType.circuit_type_id})
              </div>
              <CircuitInputsMetaTable
                circuit_inputs_meta={circuitType.circuit_inputs_meta as CircuitInputMeta[]}
              />
            </div>
          </ContentAreaRow>
        )}
      </div>
    </DefaultLayout>
  );
};

export default CircuitType;

interface CircuitTypeProps {
  params: {
    circuit_type_id: string;
  };
}
