"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import { RawCircuitInputMeta } from "@taigalabs/prfs-entities/bindings/RawCircuitInputMeta";

import styles from "./Circuit.module.scss";
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
import RawCircuitInputTable from "@/components/raw_circuit_input_table/RawCircuitInputTable";

const Circuit: React.FC<CircuitProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);
  const router = useRouter();

  const [circuit, setCircuit] = React.useState<PrfsCircuit>();

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
      <Breadcrumb>
        <BreadcrumbEntry>
          <Link href="/circuits">{i18n.circuits}</Link>
        </BreadcrumbEntry>
        <BreadcrumbEntry>{params.circuit_id}</BreadcrumbEntry>
      </Breadcrumb>
      <div className={styles.contentArea}>
        <CardRow>
          <Card>
            <Widget>
              <WidgetHeader>
                <WidgetLabel>{`${i18n.circuit} - ${params.circuit_id}`}</WidgetLabel>
              </WidgetHeader>
              <CircuitSummary circuit={circuit} />
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
                <DriverPropInstanceTable driver_properties={circuit.driver_properties} />
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
                <RawCircuitInputTable
                  raw_circuit_inputs_meta={circuit.raw_circuit_inputs_meta as RawCircuitInputMeta[]}
                />
              </Widget>
            </Card>
          </CardRow>
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
