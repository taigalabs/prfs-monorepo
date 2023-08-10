"use client";

import React from "react";
import Link from "next/link";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";

import styles from "./Set.module.scss";
import { i18nContext } from "@/contexts/i18n";
import ColumnarSummary, {
  ColumnarSummaryCell,
  ColumnarSummaryCellHeader,
  ColumnarSummaryColumn,
} from "@/components/columnal_summary/ColumnarSummary";

const SetSummary: React.FC<SetSummaryProps> = ({ set }) => {
  const i18n = React.useContext(i18nContext);

  return (
    set && (
      <ColumnarSummary>
        <ColumnarSummaryColumn>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.set_id}</ColumnarSummaryCellHeader>
            <div>{set.set_id}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.label}</ColumnarSummaryCellHeader>
            <div>{set.label}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.cardinality}</ColumnarSummaryCellHeader>
            <div>{set.cardinality.toString()}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.element_type}</ColumnarSummaryCellHeader>
            <div>{set.element_type}</div>
          </ColumnarSummaryCell>
        </ColumnarSummaryColumn>

        <ColumnarSummaryColumn>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.description}</ColumnarSummaryCellHeader>
            <div>{set.desc}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.hash_algorithm}</ColumnarSummaryCellHeader>
            <div>{set.hash_algorithm}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.elliptic_curve}</ColumnarSummaryCellHeader>
            <div>{set.elliptic_curve}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.finite_field}</ColumnarSummaryCellHeader>
            <div>{set.finite_field}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.merkle_root}</ColumnarSummaryCellHeader>
            <div>{set.merkle_root}</div>
          </ColumnarSummaryCell>
        </ColumnarSummaryColumn>

        <ColumnarSummaryColumn>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.author}</ColumnarSummaryCellHeader>
            <div>{set.author}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.created_at}</ColumnarSummaryCellHeader>
            <div>{set.created_at}</div>
          </ColumnarSummaryCell>
        </ColumnarSummaryColumn>
      </ColumnarSummary>
    )
  );
};

export default SetSummary;

interface SetSummaryProps {
  set: PrfsSet | undefined;
}
