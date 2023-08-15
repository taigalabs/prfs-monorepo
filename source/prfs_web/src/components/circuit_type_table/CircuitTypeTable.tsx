import React from "react";
import Link from "next/link";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { CircuitType } from "@taigalabs/prfs-entities/bindings/CircuitType";

import styles from "./CircuitTypeTable.module.scss";
import Table, { TableBody, TableRow, TableHeader, TableData } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";

const CircuitTypeTable: React.FC<CircuitTypeTableProps> = ({
  selectType,
  selectedVal,
  handleSelectVal,
}) => {
  const i18n = React.useContext(i18nContext);
  const [data, setData] = React.useState<TableData<CircuitType>>({ page: 0, values: [] });

  const handleChangeProofPage = React.useCallback(async (page: number) => {
    return prfsApi
      .getPrfsNativeCircuitTypes({
        page,
      })
      .then(resp => {
        const { page, prfs_circuit_types } = resp.payload;
        return {
          page,
          values: prfs_circuit_types,
        };
      });
  }, []);

  React.useEffect(() => {
    handleChangeProofPage(0).then(res => {
      setData(res);
    });
  }, [handleChangeProofPage, setData]);

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

      const isSelected = selectedVal && selectedVal.circuit_type === val.circuit_type;
      const selType = selectType || "radio";

      let row = (
        <TableRow key={val.circuit_type} onClickRow={onClickRow} isSelected={isSelected}>
          {selectedVal && (
            <td className={styles.radio}>
              <input type={selType} checked={isSelected} readOnly />
            </td>
          )}
          <td className={styles.circuit_type}>
            <Link href={`/circuit_types/${val.circuit_type}`}>{val.circuit_type}</Link>
          </td>
          <td className={styles.desc}>{val.desc}</td>
          <td className={styles.author}>{val.author}</td>
          <td className={styles.createdAt}>{val.created_at}</td>
        </TableRow>
      );

      rows.push(row);
    }

    return rows;
  }, [data]);

  return (
    <Table minWidth={880}>
      <TableHeader>
        <TableRow>
          {handleSelectVal && <th className={styles.radio}></th>}
          <th className={styles.circuit_type}>{i18n.circuit_type}</th>
          <th className={styles.desc}>{i18n.description}</th>
          <th className={styles.author}>{i18n.author}</th>
          <th className={styles.createdAt}>{i18n.created_at}</th>
        </TableRow>
      </TableHeader>
      <TableBody>{rowsElem}</TableBody>
    </Table>
  );
};

export default CircuitTypeTable;

export interface CircuitTypeTableProps {
  selectType?: "checkbox" | "radio";
  selectedVal?: CircuitType;
  handleSelectVal?: (row: CircuitType) => void;
}
