"use client";

import React from "react";
import Link from "next/link";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import styles from "./Set.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { PrfsProofType, PrfsSet } from "@/models/index";
import ColumnarSummary, {
  ColumnarSummaryCell,
  ColumnarSummaryCellHeader,
  ColumnarSummaryColumn,
} from "@/components/columnal_summary/ColumnarSummary";

const ProofTypeSummary: React.FC<ProofTypeSummaryProps> = ({ proofType }) => {
  const i18n = React.useContext(i18nContext);

  return (
    proofType && (
      <ColumnarSummary>
        <ColumnarSummaryColumn>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.proof_type_id}</ColumnarSummaryCellHeader>
            <div>{proofType.proof_type_id}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.label}</ColumnarSummaryCellHeader>
            <div>{proofType.label}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.author}</ColumnarSummaryCellHeader>
            <div>{proofType.author}</div>
          </ColumnarSummaryCell>
        </ColumnarSummaryColumn>

        <ColumnarSummaryColumn>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.description}</ColumnarSummaryCellHeader>
            <div>{proofType.desc}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.circuit_id}</ColumnarSummaryCellHeader>
            <div>
              <Link href={`/circuits/${proofType.circuit_id}`}>{proofType.circuit_id}</Link>
            </div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.program_id}</ColumnarSummaryCellHeader>
            <div>
              <Link href={`/programs/${proofType.program_id}`}>{proofType.program_id}</Link>
            </div>
          </ColumnarSummaryCell>
        </ColumnarSummaryColumn>

        <ColumnarSummaryColumn>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.created_at}</ColumnarSummaryCellHeader>
            <div>{proofType.created_at}</div>
          </ColumnarSummaryCell>
        </ColumnarSummaryColumn>
      </ColumnarSummary>
    )
  );
};

export default ProofTypeSummary;

interface ProofTypeSummaryProps {
  proofType: PrfsProofType;
}
