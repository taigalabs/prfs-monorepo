"use client";

import React from "react";
import Link from "next/link";

import styles from "./CircuitTable.module.scss";
import Table, { TableBody, TableRow, TableHeader, CreateBodyArgs } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import * as prfsBackend from "@/fetch/prfsBackend";
import { PrfsCircuit } from "@/models";

const CircuitTable: React.FC<CircuitTableProps> = ({
  selectType,
  selectedVal,
  handleSelectVal,
}) => {
  const i18n = React.useContext(i18nContext);

  const createHeader = React.useCallback(() => {
    return (
      <TableHeader>
        <TableRow>
          {handleSelectVal && <th className={styles.radio}></th>}
          <th className={styles.circuit_id}>{i18n.circuit_id}</th>
          <th className={styles.label}>{i18n.label}</th>
          <th className={styles.desc}>{i18n.description}</th>
          <th className={styles.author}>{i18n.author}</th>
          <th className={styles.createdAt}>{i18n.created_at}</th>
        </TableRow>
      </TableHeader>
    );
  }, [handleSelectVal]);

  const createBody = React.useCallback(
    ({ data, handleSelectVal, selectedVal }: CreateBodyArgs<PrfsCircuit>) => {
      let { page, values } = data;

      let rows = [];
      if (values === undefined || values.length < 1) {
        return rows;
      }

      // console.log(22, selectedVal);

      for (let val of values) {
        const onClickRow = handleSelectVal
          ? (_ev: React.MouseEvent) => {
              handleSelectVal(val);
            }
          : undefined;

        const isSelected = selectedVal && !!selectedVal[val.circuit_id];
        const selType = selectType || "radio";

        let row = (
          <TableRow key={val.circuit_id} onClickRow={onClickRow} isSelected={isSelected}>
            {selectedVal && (
              <td className={styles.radio}>
                <input type={selType} checked={isSelected} readOnly />
              </td>
            )}
            <td className={styles.circuit_id}>
              <Link href={`/circuits/${val.circuit_id}`}>{val.circuit_id}</Link>
            </td>
            <td className={styles.label}>{val.label}</td>
            <td className={styles.desc}>{val.desc}</td>
            <td className={styles.author}>{val.author}</td>
            <td className={styles.createdAt}>{val.created_at}</td>
          </TableRow>
        );

        rows.push(row);
      }

      return <TableBody key={page}>{rows}</TableBody>;
    },
    []
  );

  const handleChangeProofPage = React.useCallback(async (page: number) => {
    return prfsBackend
      .getPrfsNativeCircuits({
        page,
      })
      .then(resp => {
        const { page, prfs_circuits } = resp.payload;
        return {
          page,
          values: prfs_circuits,
        };
      });
  }, []);

  return (
    <Table
      createHeader={createHeader}
      createBody={createBody}
      onChangePage={handleChangeProofPage}
      minWidth={880}
      selectedVal={selectedVal}
      handleSelectVal={handleSelectVal}
    />
  );
};

export default CircuitTable;

export interface CircuitTableProps {
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsCircuit;
  handleSelectVal?: (row: PrfsCircuit) => void;
}
