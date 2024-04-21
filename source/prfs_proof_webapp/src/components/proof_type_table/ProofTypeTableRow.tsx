import React from "react";
import cn from "classnames";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import styles from "./ProofTypeTableRow.module.scss";
import { AppTableHeader, AppTableRow } from "@/components/app_table_components/AppTableComponents";
import {
  AppTableHeaderCell,
  AppTableCell,
} from "@/components/app_table_components/AppTableCellComponents";
import { useI18N } from "@/i18n/use_i18n";

export const ProofTypeTableHeaderRow = () => {
  const i18n = useI18N();

  return (
    <AppTableHeader>
      <AppTableHeaderCell className={cn(styles.label)} alwaysRender>
        {i18n.label}
      </AppTableHeaderCell>
      <AppTableHeaderCell className={cn(styles.desc)} w320>
        {i18n.description}
      </AppTableHeaderCell>
      <AppTableHeaderCell className={cn(styles.circuitId)} w1024>
        {i18n.circuit_id}
      </AppTableHeaderCell>
      <AppTableHeaderCell className={cn(styles.notarized)} w1280>
        {i18n.notarized}
      </AppTableHeaderCell>
      <AppTableHeaderCell className={cn(styles.onChain)} w1280>
        {i18n.on_chain}
      </AppTableHeaderCell>
      <AppTableHeaderCell flexGrow />
    </AppTableHeader>
  );
};

const ProofTypeTableRow: React.FC<RowProps> = ({ row, style }) => {
  const i18n = useI18N();

  const label = React.useMemo(() => {
    return `${row.label.substring(0, 26)}...`;
  }, [row.label]);
  const desc = React.useMemo(() => {
    return `${row.label.substring(0, 18)}...`;
  }, [row.desc]);
  const circuitId = React.useMemo(() => {
    return `${row.label.substring(0, 12)}...`;
  }, [row.circuit_id]);

  return (
    <AppTableRow style={style}>
      <AppTableCell className={cn(styles.label)} alwaysRender>
        <span>{label}</span>
      </AppTableCell>
      <AppTableCell className={cn(styles.desc)} w320>
        {desc}
      </AppTableCell>
      <AppTableCell className={cn(styles.circuitId)} w1024>
        {circuitId}
      </AppTableCell>
      <AppTableCell className={cn(styles.notarized)} w1280>
        {i18n.not_available}
      </AppTableCell>
      <AppTableCell className={cn(styles.onChain)} w1280>
        {i18n.not_available}
      </AppTableCell>
      <AppTableCell flexGrow />
    </AppTableRow>
  );
};

export default ProofTypeTableRow;

export interface RowProps {
  row: PrfsProofType;
  style: React.CSSProperties;
  router: AppRouterInstance;
}
