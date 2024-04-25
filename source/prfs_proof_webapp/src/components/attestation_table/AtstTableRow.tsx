import React from "react";
import cn from "classnames";
import { PrfsAttestation } from "@taigalabs/prfs-entities/bindings/PrfsAttestation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";
import Link from "next/link";

import styles from "./AtstTableRow.module.scss";
import { paths } from "@/paths";
import { AppTableRow } from "@/components/app_table_components/AppTableComponents";
import {
  AppTableCell,
  AppTableCellInner,
} from "@/components/app_table_components/AppTableCellComponents";
import { useI18N } from "@/i18n/use_i18n";
import { AppTableHeader } from "@/components/app_table_components/AppTableComponents";
import { AppTableHeaderCell } from "@/components/app_table_components/AppTableCellComponents";

export const AtstHeaderRow = () => {
  const i18n = useI18N();

  return (
    <AppTableHeader>
      <AppTableHeaderCell className={cn(styles.label)} alwaysRender>
        {i18n.label}
      </AppTableHeaderCell>
      <AppTableHeaderCell className={cn(styles.commitment)} w320>
        {i18n.commitment}
      </AppTableHeaderCell>
      <AppTableHeaderCell className={cn(styles.valueNum)} w480>
        {i18n.value}
      </AppTableHeaderCell>
      <AppTableHeaderCell className={cn(styles.meta)} w1024>
        {i18n.meta}
      </AppTableHeaderCell>
      <AppTableHeaderCell className={cn(styles.notarized)} w1280>
        {i18n.notarized}
      </AppTableHeaderCell>
      <AppTableHeaderCell className={cn(styles.onChain)} w1280>
        {i18n.on_chain}
      </AppTableHeaderCell>
      <AppTableHeaderCell flexGrow></AppTableHeaderCell>
    </AppTableHeader>
  );
};

const AtstRow: React.FC<AtstRowProps> = ({ atst, style, router, setIsNavigating }) => {
  const i18n = useI18N();

  const label = React.useMemo(() => {
    if (atst.label.length > 12) {
      return abbrev7and5(atst.label);
    } else {
      return atst.label;
    }
  }, [atst.label]);

  const cm = React.useMemo(() => {
    return atst.cm.length > 12 ? `${abbrev7and5(atst.cm)}` : atst.cm;
  }, [atst.cm]);

  const url = React.useMemo(() => {
    return `${paths.attestations}/g/${atst.atst_group_id}/${atst.atst_id}`;
  }, [atst]);

  const handleClickRow = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      setIsNavigating(true);
      router.push(url);
    },
    [url, router, setIsNavigating],
  );

  const meta = React.useMemo(() => {
    if (typeof atst.meta === "object") {
      return JSON.stringify(atst.meta);
    } else {
      return "";
    }
  }, [atst.cm]);

  const value = React.useMemo(() => {
    return JSON.stringify(atst.value);
  }, [atst.value]);

  return (
    <Link href={url} onClick={handleClickRow}>
      <AppTableRow style={style}>
        <AppTableCell className={cn(styles.label, styles.cell)} alwaysRender>
          <AppTableCellInner>{label}</AppTableCellInner>
        </AppTableCell>
        <AppTableCell className={cn(styles.commitment)} w320>
          <AppTableCellInner>{cm}</AppTableCellInner>
        </AppTableCell>
        <AppTableCell className={cn(styles.valueNum)} w480>
          <AppTableCellInner>{value}</AppTableCellInner>
        </AppTableCell>
        <AppTableCell className={cn(styles.meta, styles.cell)} w1024>
          <AppTableCellInner>{meta}</AppTableCellInner>
        </AppTableCell>
        <AppTableCell className={cn(styles.notarized)} w1280>
          {i18n.not_available}
        </AppTableCell>
        <AppTableCell className={cn(styles.onChain)} w1280>
          {i18n.not_available}
        </AppTableCell>
        <AppTableCell flexGrow />
      </AppTableRow>
    </Link>
  );
};

export default AtstRow;

export interface AtstRowProps {
  atst: PrfsAttestation;
  style: React.CSSProperties;
  router: AppRouterInstance;
  setIsNavigating: React.Dispatch<React.SetStateAction<boolean>>;
}
