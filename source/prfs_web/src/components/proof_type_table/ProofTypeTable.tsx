"use client";

import React from "react";
import Link from "next/link";

import styles from "./ProofTypeTable.module.scss";
import Table, { TableBody, TableRow, TableHeader, CreateBodyArgs } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import * as prfsBackend from "@/fetch/prfsBackend";
import { PrfsProofType } from "@/models";

const ProofTypeTable: React.FC<ProofTypeTableProps> = () => {
  const i18n = React.useContext(i18nContext);

  const createHeader = React.useCallback(() => {
    return (
      <TableHeader>
        <TableRow>
          <th className={styles.proofTypeId}>{i18n.proof_type_id}</th>
          <th className={styles.label}>{i18n.label}</th>
          <th className={styles.desc}>{i18n.description}</th>
          <th className={styles.circuitId}>{i18n.circuit_id}</th>
          <th className={styles.createdAt}>{i18n.created_at}</th>
        </TableRow>
      </TableHeader>
    );
  }, []);

  const createBody = React.useCallback(({ data }: CreateBodyArgs<PrfsProofType>) => {
    console.log(1, data);

    let { page, values } = data;

    let rows = [];
    if (values === undefined || values.length < 1) {
      return rows;
    }

    for (let val of values) {
      let row = (
        <TableRow key={val.proof_type_id}>
          <td className={styles.proofTypeId}>
            <Link href={`/proof_types/${val.proof_type_id}`}>{val.proof_type_id}</Link>
          </td>
          <td className={styles.label}>{val.label}</td>
          <td className={styles.desc}>{val.desc}</td>
          <td className={styles.circuitId}>{val.circuit_id}</td>
          <td className={styles.createdAt}>{val.created_at}</td>
        </TableRow>
      );

      rows.push(row);
    }

    return <TableBody key={page}>{rows}</TableBody>;
  }, []);

  const handleChangePage = React.useCallback(async (page: number) => {
    return prfsBackend
      .getPrfsProofTypes({
        page,
      })
      .then(resp => {
        const { page, prfs_proof_types } = resp.payload;
        return {
          page,
          values: prfs_proof_types,
        };
      });
  }, []);

  return (
    <Table
      createHeader={createHeader}
      createBody={createBody}
      onChangePage={handleChangePage}
      minWidth={800}
    />
  );
};

export default ProofTypeTable;

export interface ProofTypeTableProps {}
