import React from "react";
import Link from "next/link";
import { CircuitType } from "@taigalabs/prfs-entities/bindings/CircuitType";

import styles from "./CircuitTypeSummary.module.scss";
import { i18nContext } from "@/contexts/i18n";
import ColumnarSummary, {
  ColumnarSummaryCell,
  ColumnarSummaryCellHeader,
  ColumnarSummaryColumn,
} from "@/components/columnal_summary/ColumnarSummary";

const CircuitTypeSummary: React.FC<CircuitSummaryProps> = ({ circuitType }) => {
  const i18n = React.useContext(i18nContext);

  return (
    circuitType && (
      <ColumnarSummary>
        <ColumnarSummaryColumn>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.circuit_type}</ColumnarSummaryCellHeader>
            <div>{circuitType.circuit_type}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.created_at}</ColumnarSummaryCellHeader>
            <div>{circuitType.created_at}</div>
          </ColumnarSummaryCell>
        </ColumnarSummaryColumn>

        <ColumnarSummaryColumn>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.description}</ColumnarSummaryCellHeader>
            <div>{circuitType.desc}</div>
          </ColumnarSummaryCell>
        </ColumnarSummaryColumn>

        <ColumnarSummaryColumn>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.author}</ColumnarSummaryCellHeader>
            <div>{circuitType.author}</div>
          </ColumnarSummaryCell>
        </ColumnarSummaryColumn>
      </ColumnarSummary>
    )
  );
};

export default CircuitTypeSummary;

interface CircuitSummaryProps {
  circuitType: CircuitType | undefined;
}
