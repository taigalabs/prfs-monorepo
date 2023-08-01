import React from "react";
import Link from "next/link";

import styles from "./CircuitProgramSummary.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { PrfsCircuit, PrfsCircuitProgram } from "@/models/index";
import ColumnarSummary, {
  ColumnarSummaryCell,
  ColumnarSummaryCellHeader,
  ColumnarSummaryColumn,
} from "@/components/columnal_summary/ColumnarSummary";

const NUM_COLUMNS = 3;

const CircuitProgramSummary: React.FC<CircuitProgramSummaryProps> = ({ program }) => {
  const i18n = React.useContext(i18nContext);

  return (
    program && (
      <ColumnarSummary>
        <ColumnarSummaryColumn>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.program_id}</ColumnarSummaryCellHeader>
            <div>{program.program_id}</div>
          </ColumnarSummaryCell>
        </ColumnarSummaryColumn>
        <ColumnarSummaryColumn>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.program_repository_url}</ColumnarSummaryCellHeader>
            <div>
              <Link href={program.program_repository_url}>{program.program_repository_url}</Link>
            </div>
          </ColumnarSummaryCell>
        </ColumnarSummaryColumn>
        <ColumnarSummaryColumn>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.version}</ColumnarSummaryCellHeader>
            <div>{program.version}</div>
          </ColumnarSummaryCell>
        </ColumnarSummaryColumn>
      </ColumnarSummary>
    )
  );
};

export default CircuitProgramSummary;

interface CircuitProgramSummaryProps {
  program: PrfsCircuitProgram;
}
