import React from "react";

import styles from "./CircuitProgramSummary.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { PrfsCircuit } from "@/models/index";
import ColumnarSummary, {
  ColumnarSummaryCell,
  ColumnarSummaryCellHeader,
  ColumnarSummaryColumn,
} from "@/components/columnal_summary/ColumnarSummary";

const NUM_COLUMNS = 3;

const CircuitProgramSummary: React.FC<CircuitProgramSummaryProps> = ({ circuit }) => {
  const i18n = React.useContext(i18nContext);

  const columnElems = React.useMemo(() => {
    if (circuit === undefined) {
      return null;
    }

    let { program } = circuit;
    let { properties } = program;
    let propertyKeys = Object.keys(properties);

    const q = Math.floor(propertyKeys.length / NUM_COLUMNS);
    const r = propertyKeys.length % NUM_COLUMNS;

    const columns = [[], [], []];
    for (let i = 0; i < q; i += 1) {
      for (let j = 0; j < NUM_COLUMNS; j += 1) {
        const idx = i * NUM_COLUMNS + j;

        const cell = (
          <ColumnarSummaryCell key={propertyKeys[idx]}>
            <ColumnarSummaryCellHeader>{propertyKeys[idx]}</ColumnarSummaryCellHeader>
            <div>{properties[propertyKeys[idx]]}</div>
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
          <div>{properties[propertyKeys[i]]}</div>
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

export default CircuitProgramSummary;

interface CircuitProgramSummaryProps {
  circuit: PrfsCircuit;
}
