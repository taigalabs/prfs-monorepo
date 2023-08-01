import React from "react";
import Link from "next/link";

import styles from "./CircuitProgramInstanceSummary.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { PrfsCircuit } from "@/models/index";
import ColumnarSummary, {
  ColumnarSummaryCell,
  ColumnarSummaryCellHeader,
  ColumnarSummaryColumn,
} from "@/components/columnal_summary/ColumnarSummary";

const NUM_COLUMNS = 3;

const CircuitProgramInstanceSummary: React.FC<CircuitProgramInstanceSummaryProps> = ({
  circuit,
}) => {
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
    columns[0].push(
      <ColumnarSummaryCell key={program.program_id}>
        <ColumnarSummaryCellHeader>{i18n.program_id}</ColumnarSummaryCellHeader>
        <div className={styles.cellValue}>
          <Link href={`/programs/${program.program_id}`}>{program.program_id}</Link>
        </div>
      </ColumnarSummaryCell>
    );

    columns[1].push(
      <ColumnarSummaryCell key={program.version}>
        <ColumnarSummaryCellHeader>{i18n.version}</ColumnarSummaryCellHeader>
        <div>{program.version}</div>
      </ColumnarSummaryCell>
    );

    columns[2].push(
      <ColumnarSummaryCell key={program.program_repository_url}>
        <ColumnarSummaryCellHeader>{i18n.program_repository_url}</ColumnarSummaryCellHeader>
        <div className={styles.cellValue}>
          <Link href={program.program_repository_url}>{program.program_repository_url}</Link>
        </div>
      </ColumnarSummaryCell>
    );

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

export default CircuitProgramInstanceSummary;

interface CircuitProgramInstanceSummaryProps {
  circuit: PrfsCircuit;
}
