"use client";

import React from "react";
import Link from "next/link";

import styles from "./CircuitProgramTable.module.scss";
import Table, {
  TableBody,
  TableRow,
  TableHeader,
  CreateBodyArgs,
  TableSelectedValue,
} from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import * as prfsBackend from "@/fetch/prfsBackend";
import { KeysAsObject, RecordOfKeys } from "@/models/types";
import { PRFS_CIRCUIT_PROGRAM_KEYS, PrfsCircuitProgramKeys } from "@/models";

const CircuitProgramTable: React.FC<CircuitTableProps> = ({
  selectType,
  selectedVal,
  handleSelectVal,
}) => {
  const i18n = React.useContext(i18nContext);

  const createHeader = React.useCallback(
    (keys: KeysAsObject<PrfsCircuitProgramKeys>) => {
      return (
        <TableHeader>
          <TableRow>
            {handleSelectVal && <th key="select" className={styles.radio}></th>}
            <th key={keys.program_id} className={styles.program_id}>
              {i18n.program_id}
            </th>
            <th key={keys.program_repository_url} className={styles.program_repository_url}>
              {i18n.program_repository_url}
            </th>
            <th key={keys.version} className={styles.version}>
              {i18n.version}
            </th>
          </TableRow>
        </TableHeader>
      );
    },
    [handleSelectVal]
  );

  const createBody = React.useCallback(
    ({ keys, data, handleSelectVal, selectedVal }: CreateBodyArgs<PrfsCircuitProgramKeys>) => {
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
              <td key="select" className={styles.radio}>
                <input type={selType} checked={isSelected} readOnly />
              </td>
            )}
            <td key={keys.program_id} className={styles.program_id}>
              <Link href={`/programs/${val.program_id}`}>{val.program_id}</Link>
            </td>
            <td key={keys.program_repository_url} className={styles.repoUrl}>
              {val.program_repository_url}
            </td>
            <td key={keys.version} className={styles.version}>
              {val.version}
            </td>
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
      keys={PRFS_CIRCUIT_PROGRAM_KEYS}
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
  selectedVal?: TableSelectedValue<PrfsCircuitProgramKeys>;
  handleSelectVal?: (row: RecordOfKeys<PrfsCircuitProgramKeys>) => void;
}
