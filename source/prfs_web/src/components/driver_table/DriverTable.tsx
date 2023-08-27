"use client";

import React from "react";
import Link from "next/link";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PrfsCircuitDriver } from "@taigalabs/prfs-entities/bindings/PrfsCircuitDriver";
import Table, {
  TableBody,
  TableHeader,
  TableData,
  TableRecordData,
  TableRow,
  TableSearch,
} from "@taigalabs/prfs-react-components/src/table/Table";

import styles from "./DriverTable.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const DriverTable: React.FC<DriverTableProps> = ({ selectType, selectedVal, handleSelectVal }) => {
  const i18n = React.useContext(i18nContext);
  const [data, setData] = React.useState<TableData<PrfsCircuitDriver>>({ page: 0, values: [] });

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

      const isSelected = selectedVal && selectedVal.circuit_driver_id == val.circuit_driver_id;
      const selType = selectType || "radio";

      let row = (
        <TableRow key={val.circuit_driver_id} onClickRow={onClickRow} isSelected={isSelected}>
          {selectedVal && (
            <td className={styles.radio}>
              <input type={selType} checked={isSelected} readOnly />
            </td>
          )}
          <td className={styles.driver_id}>
            <Link href={`${paths.proof__circuit_drivers}/${val.circuit_driver_id}`}>
              {val.circuit_driver_id}
            </Link>
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
    <div>
      <TableSearch>
        <input placeholder={i18n.driver_search_guide} />
      </TableSearch>
      <Table>
        <TableHeader>
          <TableRow>
            {handleSelectVal && <th className={styles.radio}></th>}
            <th className={styles.driver_id}>{i18n.circuit_driver_id}</th>
            <th className={styles.driver_repository_url}>{i18n.driver_repository_url}</th>
            <th className={styles.version}>{i18n.version}</th>
          </TableRow>
        </TableHeader>
        <TableBody>{rowsElem}</TableBody>
      </Table>
    </div>
  );
};

export default DriverTable;

export interface DriverTableProps {
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsCircuitDriver;
  handleSelectVal?: (row: PrfsCircuitDriver) => void;
}
