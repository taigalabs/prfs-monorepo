"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { CircuitInputMeta } from "@taigalabs/prfs-entities/bindings/CircuitInputMeta";
import { CircuitType } from "@taigalabs/prfs-entities/bindings/CircuitType";

import styles from "./CircuitType.module.scss";
import { stateContext } from "@/contexts/state";
import Widget, { WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import Breadcrumb, { BreadcrumbEntry } from "@/components/breadcrumb/Breadcrumb";
import CircuitSummary from "@/components/circuit_summary/CircuitSummary";
import DriverPropInstanceTable from "@/components/driver_prop_instance_table/DriverPropInstanceTable";
import CircuitInputTable from "@/components/circuit_input_table/CircuitInputTable";
import CircuitTypeSummary from "@/components/circuit_type_summary/CircuitTypeSummary";
import DriverInputsMetaTable from "@/components/driver_inputs_meta_table/DriverInputsMetaTable";
import { DriverInputMeta } from "@taigalabs/prfs-entities/bindings/DriverInputMeta";

const CircuitType: React.FC<CircuitTypeProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);
  const router = useRouter();

  const [circuitType, setCircuitType] = React.useState<CircuitType>();

  React.useEffect(() => {
    prfsApi
      .getPrfsNativeCircuitTypes({
        page: 0,
        circuit_type_id: params.circuit_type_id,
      })
      .then(resp => {
        const { prfs_circuit_types } = resp.payload;

        if (prfs_circuit_types.length > 0) {
          setCircuitType(prfs_circuit_types[0]);
        } else {
          router.push("/circuits");
        }
      });
  }, [setCircuitType]);

  return (
    <DefaultLayout>
      <Breadcrumb>
        <BreadcrumbEntry>
          <Link href="/circuit_types">{i18n.circuit_types}</Link>
        </BreadcrumbEntry>
        <BreadcrumbEntry>{params.circuit_type_id}</BreadcrumbEntry>
      </Breadcrumb>
      <div className={styles.contentArea}>
        <CardRow>
          <Card>
            <Widget>
              <WidgetHeader>
                <WidgetLabel>{`${i18n.circuit_type} - ${params.circuit_type_id}`}</WidgetLabel>
              </WidgetHeader>
              <CircuitTypeSummary circuitType={circuitType} />
            </Widget>
          </Card>
        </CardRow>
        {circuitType && (
          <CardRow>
            <Card>
              <Widget>
                <WidgetHeader>
                  <WidgetLabel>
                    {i18n.driver_inputs_meta} ({circuitType.circuit_type})
                  </WidgetLabel>
                </WidgetHeader>
                <DriverInputsMetaTable
                  driver_inputs_meta={circuitType.driver_inputs_meta as DriverInputMeta[]}
                />
              </Widget>
            </Card>
          </CardRow>
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
