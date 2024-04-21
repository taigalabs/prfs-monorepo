import React from "react";
import cn from "classnames";
import { PrfsAttestation } from "@taigalabs/prfs-entities/bindings/PrfsAttestation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";
import Link from "next/link";

import styles from "./AtstRow.module.scss";
import { paths } from "@/paths";
import {
  AttestationTableRow,
  AttestationTableCell,
} from "@/components/atst_table_components/AtstTableComponents";

import { useI18N } from "@/i18n/use_i18n";

const AtstRow: React.FC<AtstRowProps> = ({ atst, style, router, setIsNavigating }) => {
  const i18n = useI18N();

  const label = React.useMemo(() => {
    return abbrev7and5(atst.label);
  }, [atst.label]);

  const cm = React.useMemo(() => {
    return `${atst.cm.substring(0, 12)}...`;
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
      <AttestationTableRow style={style}>
        <AttestationTableCell className={cn(styles.label, styles.cell)}>
          <span>{label}</span>
        </AttestationTableCell>
        <AttestationTableCell className={cn(styles.commitment, styles.w1024)}>
          {cm}
        </AttestationTableCell>
        <AttestationTableCell className={cn(styles.valueNum, styles.w1024)}>
          {value}
        </AttestationTableCell>
        <AttestationTableCell className={cn(styles.meta, styles.w480, styles.cell)}>
          <span>{meta}</span>
        </AttestationTableCell>
        <AttestationTableCell className={cn(styles.notarized, styles.w1320)}>
          {i18n.not_available}
        </AttestationTableCell>
        <AttestationTableCell className={cn(styles.onChain, styles.w1320)}>
          {i18n.not_available}
        </AttestationTableCell>
      </AttestationTableRow>
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
