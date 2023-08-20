"use client";

import React from "react";
import Link from "next/link";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { CircuitDriver } from "@taigalabs/prfs-entities/bindings/CircuitDriver";
import Table, {
  TableBody,
  TableHeader,
  TableData,
  TableRecordData,
  TableRow,
} from "@taigalabs/prfs-react-components/src/table/Table";

import styles from "./DriverTable.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/routes/path";

const DriverTable: React.FC<DriverTableProps> = ({ selectType, selectedVal, handleSelectVal }) => {
  const i18n = React.useContext(i18nContext);
  const [data, setData] = React.useState<TableData<CircuitDriver>>({ page: 0, values: [] });

  const handleChangeProofPage = React.useCallback(async (page: number) => {
    return prfsApi
      .getPrfsNativeCircuitDrivers({
        page,
      })
      .then(resp => {
        const { page, prfs_circuit_drivers } = resp.payload;
        return {
          page,
          values: prfs_circuit_drivers,
        };
      });
  }, []);

  React.useEffect(() => {
    Promise.resolve(handleChangeProofPage(0)).then(res => {
      setData(res);
    });
  }, [setData, handleChangeProofPage]);

  const rowsElem = React.useMemo(() => {
    let { page, values } = data;

    let rows: React.ReactNode[] = [];
    if (values === undefined || values.length < 1) {
      return rows;
    }

    for (let val of values) {
      const onClickRow = handleSelectVal
        ? (_ev: React.MouseEvent) => {
            handleSelectVal(val);
          }
        : undefined;

      const isSelected = selectedVal && selectedVal.driver_id == val.driver_id;
      const selType = selectType || "radio";

      let row = (
        <TableRow key={val.driver_id} onClickRow={onClickRow} isSelected={isSelected}>
          {selectedVal && (
            <td className={styles.radio}>
              <input type={selType} checked={isSelected} readOnly />
            </td>
          )}
          <td className={styles.driver_id}>
            <Link href={`${paths.proof__circuit_drivers}/${val.driver_id}`}>{val.driver_id}</Link>
          </td>
          <td className={styles.repoUrl}>{val.driver_repository_url}</td>
          <td className={styles.version}>{val.version}</td>
        </TableRow>
      );

      rows.push(row);
    }

    return rows;
  }, [data]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {handleSelectVal && <th className={styles.radio}></th>}
          <th className={styles.driver_id}>{i18n.driver_id}</th>
          <th className={styles.driver_repository_url}>{i18n.driver_repository_url}</th>
          <th className={styles.version}>{i18n.version}</th>
        </TableRow>
      </TableHeader>
      <TableBody>{rowsElem}</TableBody>
    </Table>
  );
};

export default DriverTable;

export interface DriverTableProps {
  selectType?: "checkbox" | "radio";
  selectedVal?: CircuitDriver;
  handleSelectVal?: (row: CircuitDriver) => void;
}
