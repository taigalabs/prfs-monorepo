"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PrfsCircuitSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsCircuitSyn1";
import { RawCircuitInputMeta } from "@taigalabs/prfs-entities/bindings/RawCircuitInputMeta";
import { PaddedTableWrapper } from "@taigalabs/prfs-react-components/src/table/Table";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";

import styles from "./Circuit.module.scss";
import { stateContext } from "@/contexts/state";
import Widget, { TopWidgetTitle, WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import { paths } from "@/paths";
import CircuitSummary from "@/components/circuit_summary/CircuitSummary";
import DriverPropInstanceTable from "@/components/driver_prop_instance_table/DriverPropInstanceTable";
import RawCircuitInputMetaTable from "@/components/raw_circuit_input_meta_table/RawCircuitInputMetaTable";
import CircuitInputMetaTable from "@/components/circuit_input_meta_table/CircuitInputMetaTable";
import { CircuitInputMeta } from "@taigalabs/prfs-entities/bindings/CircuitInputMeta";
import { PaddedSummaryWrapper } from "@/components/columnal_summary/ColumnarSummary";
import { ContentAreaHeader, ContentAreaRow } from "@/components/content_area/ContentArea";
import Table2 from "@/components/table2/Table2";

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
        const { payload } = await prfsApi.getPrfsNativeCircuits({
          page: 0,
          circuit_id: params.circuit_id,
        });

        const { prfs_circuits_syn1 } = payload;

        if (prfs_circuits_syn1.length > 0) {
          setCircuit(prfs_circuits_syn1[0]);
        } else {
          // router.push(paths.proof__circuits);
        }
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

      <ContentAreaRow>
        <Widget>
          <PaddedSummaryWrapper>
            <Table2 />
            {/* <CircuitSummary circuit={circuit} /> */}
          </PaddedSummaryWrapper>
        </Widget>
      </ContentAreaRow>

      {circuit && (
        <ContentAreaRow>
          <Widget>
            <WidgetHeader>
              <WidgetLabel>
                {i18n.driver_properties} ({circuit.circuit_driver_id})
              </WidgetLabel>
            </WidgetHeader>
            <PaddedTableWrapper>
              <DriverPropInstanceTable driver_properties={circuit.driver_properties} />
            </PaddedTableWrapper>
          </Widget>
        </ContentAreaRow>
      )}

      {circuit && (
        <ContentAreaRow>
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
        </ContentAreaRow>
      )}

      {circuit && (
        <ContentAreaRow>
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
        </ContentAreaRow>
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
