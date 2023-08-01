"use client";

import React from "react";
import Link from "next/link";

import styles from "./CircuitProgramTable.module.scss";
import Table, { TableBody, TableRow, TableHeader, CreateBodyArgs } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import * as prfsBackend from "@/fetch/prfsBackend";
import { PrfsCircuitProgram } from "@/models";

const CircuitProgramTable: React.FC<CircuitTableProps> = ({
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
          <th className={styles.program_id}>{i18n.program_id}</th>
          <th className={styles.program_repository_url}>{i18n.program_repository_url}</th>
          <th className={styles.version}>{i18n.version}</th>
        </TableRow>
      </TableHeader>
    );
  }, [handleSelectVal]);

  const createBody = React.useCallback(
    ({ data, handleSelectVal, selectedVal }: CreateBodyArgs<PrfsCircuitProgram>) => {
      let { page, values } = data;

      let rows = [];
      if (values === undefined || values.length < 1) {
        return rows;
      }

      for (let val of values) {
        const onClickRow = handleSelectVal
          ? (_ev: React.MouseEvent) => {
              handleSelectVal(val);
            }
          : undefined;

        const isSelected = selectedVal && !!selectedVal[val.program_id];
        const selType = selectType || "radio";

        console.log(3, val);

        let row = (
          <TableRow key={val.program_id} onClickRow={onClickRow} isSelected={isSelected}>
            {selectedVal && (
              <td className={styles.radio}>
                <input type={selType} checked={isSelected} readOnly />
              </td>
            )}
            <td className={styles.program_id}>
              <Link href={`/programs/${val.program_id}`}>{val.program_id}</Link>
            </td>
            <td className={styles.repoUrl}>{val.program_repository_url}</td>
            <td className={styles.version}>{val.version}</td>
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
      .getPrfsNativeCircuitPrograms({
        page,
      })
      .then(resp => {
        const { page, prfs_circuit_programs } = resp.payload;
        return {
          page,
          values: prfs_circuit_programs,
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

export default CircuitProgramTable;

export interface CircuitTableProps {
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsCircuitProgram;
  handleSelectVal?: (row: PrfsCircuitProgram) => void;
}
