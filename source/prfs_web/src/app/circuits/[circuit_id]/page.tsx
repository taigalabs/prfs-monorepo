"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import { RawCircuitInputMeta } from "@taigalabs/prfs-entities/bindings/RawCircuitInputMeta";

import styles from "./Circuit.module.scss";
import { stateContext } from "@/contexts/state";
import Widget, { TopWidgetTitle, WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import Breadcrumb, { BreadcrumbEntry } from "@/components/breadcrumb/Breadcrumb";
import CircuitSummary from "@/components/circuit_summary/CircuitSummary";
import DriverPropInstanceTable from "@/components/driver_prop_instance_table/DriverPropInstanceTable";
import RawCircuitInputMetaTable from "@/components/raw_circuit_input_meta_table/RawCircuitInputMetaTable";
import CircuitInputTable from "@/components/circuit_input_table/CircuitInputTable";
import CircuitInputMetaTable from "@/components/circuit_input_meta_table/CircuitInputMetaTable";
import { CircuitInputMeta } from "@taigalabs/prfs-entities/bindings/CircuitInputMeta";
import { PaddedSummaryWrapper } from "@/components/columnal_summary/ColumnarSummary";
import { PaddedTableWrapper } from "@/components/table/Table";

const Circuit: React.FC<CircuitProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);
  const router = useRouter();
  const [circuit, setCircuit] = React.useState<PrfsCircuit>();

  useLocalWallet(dispatch);

  const topWidgetLabel = `${i18n.circuit_summary_label} ${params.circuit_id}`;

  React.useEffect(() => {
    prfsApi
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
      <CardRow>
        <Card>
          <Widget>
            <TopWidgetTitle>
              <div className={styles.circuitHeader}>
                <div className={styles.breadcrumbContainer}>
                  <Breadcrumb>
                    <BreadcrumbEntry>
                      <Link href="/circuits">{i18n.circuits}</Link>
                    </BreadcrumbEntry>
                    <BreadcrumbEntry>{params.circuit_id}</BreadcrumbEntry>
                  </Breadcrumb>
                </div>
                <WidgetLabel>{topWidgetLabel}</WidgetLabel>
              </div>
            </TopWidgetTitle>
            <PaddedSummaryWrapper>
              <CircuitSummary circuit={circuit} />
            </PaddedSummaryWrapper>
          </Widget>
        </Card>
      </CardRow>
      {circuit && (
        <CardRow>
          <Card>
            <Widget>
              <WidgetHeader>
                <WidgetLabel>
                  {i18n.driver_properties} ({circuit.driver_id})
                </WidgetLabel>
              </WidgetHeader>
              <PaddedTableWrapper>
                <DriverPropInstanceTable driver_properties={circuit.driver_properties} />
              </PaddedTableWrapper>
            </Widget>
          </Card>
        </CardRow>
      )}
      {circuit && (
        <CardRow>
          <Card>
            <Widget>
              <WidgetHeader>
                <WidgetLabel>{i18n.circuit_inputs}</WidgetLabel>
              </WidgetHeader>
              <PaddedTableWrapper>
                <CircuitInputMetaTable
                  circuit_inputs_meta={circuit.circuit_inputs_meta as CircuitInputMeta[]}
                />
              </PaddedTableWrapper>
            </Widget>
          </Card>
        </CardRow>
      )}
      {circuit && (
        <CardRow>
          <Card>
            <Widget>
              <WidgetHeader>
                <WidgetLabel>{i18n.raw_circuit_inputs}</WidgetLabel>
              </WidgetHeader>
              <PaddedTableWrapper>
                <RawCircuitInputMetaTable
                  raw_circuit_inputs_meta={circuit.raw_circuit_inputs_meta as RawCircuitInputMeta[]}
                />
              </PaddedTableWrapper>
            </Widget>
          </Card>
        </CardRow>
      )}
    </DefaultLayout>
  );
};

export default Circuit;

interface CircuitProps {
  params: {
    circuit_id: string;
  };
}
