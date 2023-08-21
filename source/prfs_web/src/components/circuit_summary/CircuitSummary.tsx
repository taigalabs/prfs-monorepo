import React from "react";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import Link from "next/link";

import styles from "./CircuitSummary.module.scss";
import { i18nContext } from "@/contexts/i18n";
import ColumnarSummary, {
  ColumnarSummaryCell,
  ColumnarSummaryCellHeader,
  ColumnarSummaryColumn,
} from "@/components/columnal_summary/ColumnarSummary";
import { paths } from "@/routes/path";

const CircuitSummary: React.FC<CircuitSummaryProps> = ({ circuit }) => {
  const i18n = React.useContext(i18nContext);

  return (
    circuit && (
      <ColumnarSummary>
        <ColumnarSummaryColumn>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.circuit_id}</ColumnarSummaryCellHeader>
            <div>{circuit.circuit_id}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.label}</ColumnarSummaryCellHeader>
            <div>{circuit.label}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.proof_algorithm}</ColumnarSummaryCellHeader>
            <div>{circuit.proof_algorithm}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.elliptic_curve}</ColumnarSummaryCellHeader>
            <div>{circuit.elliptic_curve}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.finite_field}</ColumnarSummaryCellHeader>
            <div>{circuit.finite_field}</div>
          </ColumnarSummaryCell>
        </ColumnarSummaryColumn>

        <ColumnarSummaryColumn>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.circuit_dsl}</ColumnarSummaryCellHeader>
            <div>{circuit.circuit_dsl}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.arithmetization}</ColumnarSummaryCellHeader>
            <div>{circuit.arithmetization}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.description}</ColumnarSummaryCellHeader>
            <div>{circuit.desc}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.driver_id}</ColumnarSummaryCellHeader>
            <div>
              <Link href={`${paths.proof__circuit_drivers}/${circuit.driver_id}`}>
                {circuit.driver_id}
              </Link>
            </div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.driver_version}</ColumnarSummaryCellHeader>
            <div>{circuit.driver_version}</div>
          </ColumnarSummaryCell>
        </ColumnarSummaryColumn>

        <ColumnarSummaryColumn>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.num_inputs}</ColumnarSummaryCellHeader>
            <div>{circuit.raw_circuit_inputs_meta.length}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.author}</ColumnarSummaryCellHeader>
            <div>{circuit.author}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.created_at}</ColumnarSummaryCellHeader>
            <div>{circuit.created_at}</div>
          </ColumnarSummaryCell>
        </ColumnarSummaryColumn>
      </ColumnarSummary>
    )
  );
};

export default CircuitSummary;

interface CircuitSummaryProps {
  circuit: PrfsCircuit | undefined;
}
