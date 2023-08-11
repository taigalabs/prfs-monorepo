import React, { ReactNode } from "react";
import Link from "next/link";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";

import styles from "./DriverInstanceSummary.module.scss";
import { i18nContext } from "@/contexts/i18n";
import ColumnarSummary, {
  ColumnarSummaryCell,
  ColumnarSummaryCellHeader,
  ColumnarSummaryColumn,
} from "@/components/columnal_summary/ColumnarSummary";

const NUM_COLUMNS = 3;

const CircuitDriverInstanceSummary: React.FC<CircuitDriverInstanceSummaryProps> = ({ circuit }) => {
  const i18n = React.useContext(i18nContext);

  const columnElems = React.useMemo(() => {
    if (circuit === undefined) {
      return [];
    }

    // let { driver } = circuit;
    // let { properties } = driver;
    let propertyKeys = Object.keys(circuit.driver_properties);

    const q = Math.floor(propertyKeys.length / NUM_COLUMNS);
    const r = propertyKeys.length % NUM_COLUMNS;

    const columns: [ReactNode[], ReactNode[], ReactNode[]] = [[], [], []];
    columns[0].push(
      <ColumnarSummaryCell key={circuit.driver_id}>
        <ColumnarSummaryCellHeader>{i18n.driver_id}</ColumnarSummaryCellHeader>
        <div>
          <Link href={`/drivers/${circuit.driver_id}`}>{circuit.driver_id}</Link>
        </div>
      </ColumnarSummaryCell>
    );

    columns[1].push(
      <ColumnarSummaryCell key={circuit.driver_version}>
        <ColumnarSummaryCellHeader>{i18n.version}</ColumnarSummaryCellHeader>
        <div>{circuit.driver_version}</div>
      </ColumnarSummaryCell>
    );

    for (let i = 0; i < q; i += 1) {
      for (let j = 0; j < NUM_COLUMNS; j += 1) {
        const idx = i * NUM_COLUMNS + j;

        const cell = (
          <ColumnarSummaryCell key={propertyKeys[idx]}>
            <ColumnarSummaryCellHeader>{propertyKeys[idx]}</ColumnarSummaryCellHeader>
            <div>{circuit.driver_properties[propertyKeys[idx]]}</div>
          </ColumnarSummaryCell>
        );

        columns[j].push(cell);
      }
    }

    const startIdx = NUM_COLUMNS * q;
    for (let i = startIdx; i < startIdx + r; i += 1) {
      const cell = (
        <ColumnarSummaryCell key={propertyKeys[i]}>
          <ColumnarSummaryCellHeader>{propertyKeys[i]}</ColumnarSummaryCellHeader>
          <div>{circuit.driver_properties[propertyKeys[i]]}</div>
        </ColumnarSummaryCell>
      );

      columns[i % NUM_COLUMNS].push(cell);
    }

    return columns;
  }, [circuit]);

  return (
    circuit && (
      <ColumnarSummary>
        <ColumnarSummaryColumn>{columnElems[0]}</ColumnarSummaryColumn>
        <ColumnarSummaryColumn>{columnElems[1]}</ColumnarSummaryColumn>
        <ColumnarSummaryColumn>{columnElems[2]}</ColumnarSummaryColumn>
      </ColumnarSummary>
    )
  );
};

export default CircuitDriverInstanceSummary;

interface CircuitDriverInstanceSummaryProps {
  circuit: PrfsCircuit | undefined;
}
