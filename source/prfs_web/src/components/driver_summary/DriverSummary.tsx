import React from "react";
import Link from "next/link";
import { CircuitDriver } from "@taigalabs/prfs-entities/bindings/CircuitDriver";

import styles from "./DriverSummary.module.scss";
import { i18nContext } from "@/contexts/i18n";
import ColumnarSummary, {
  ColumnarSummaryCell,
  ColumnarSummaryCellHeader,
  ColumnarSummaryColumn,
} from "@/components/columnal_summary/ColumnarSummary";

const NUM_COLUMNS = 3;

const DriverSummary: React.FC<DriverSummaryProps> = ({ driver }) => {
  const i18n = React.useContext(i18nContext);

  return (
    driver && (
      <ColumnarSummary>
        <ColumnarSummaryColumn>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.driver_id}</ColumnarSummaryCellHeader>
            <div>{driver.driver_id}</div>
          </ColumnarSummaryCell>
        </ColumnarSummaryColumn>
        <ColumnarSummaryColumn>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.driver_repository_url}</ColumnarSummaryCellHeader>
            <div>
              <Link href={driver.driver_repository_url}>{driver.driver_repository_url}</Link>
            </div>
          </ColumnarSummaryCell>
        </ColumnarSummaryColumn>
        <ColumnarSummaryColumn>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.version}</ColumnarSummaryCellHeader>
            <div>{driver.version}</div>
          </ColumnarSummaryCell>
        </ColumnarSummaryColumn>
      </ColumnarSummary>
    )
  );
};

export default DriverSummary;

interface DriverSummaryProps {
  driver: CircuitDriver;
}
