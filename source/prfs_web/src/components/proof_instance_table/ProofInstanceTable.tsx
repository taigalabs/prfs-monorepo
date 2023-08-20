"use client";

import React from "react";
import Link from "next/link";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import Table, {
  TableBody,
  TableHeader,
  TableRecordData,
  TableData,
  TableRow,
  TableSearch,
} from "@taigalabs/prfs-react-components/src/table/Table";

import styles from "./ProofInstanceTable.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { useConnect, useSigner } from "@thirdweb-dev/react";
import { useWallet } from "@thirdweb-dev/react";
import { PrfsProofInstance } from "@taigalabs/prfs-entities/bindings/PrfsProofInstance";
import { paths } from "@/routes/path";

const ProofInstanceTable: React.FC<ProofInstanceTableProps> = ({
  selectType,
  selectedVal,
  handleSelectVal,
}) => {
  const i18n = React.useContext(i18nContext);
  const [data, setData] = React.useState<TableData<PrfsProofInstance>>({ page: 0, values: [] });

  const handleChangeProofPage = React.useCallback(async (page: number) => {
    return prfsApi
      .getPrfsProofInstances({
        page,
        limit: 20,
      })
      .then(resp => {
        const { page, prfs_proof_instances } = resp.payload;
        return {
          page,
          values: prfs_proof_instances,
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

      const isSelected = selectedVal && selectedVal.id == val.id;
      const selType = selectType || "radio";

      const shortPublicInputs = JSON.stringify(val.public_inputs).substring(0, 40);

      let row = (
        <TableRow key={val.id as any} onClickRow={onClickRow} isSelected={isSelected}>
          {selectedVal && (
            <td className={styles.radio}>
              <input type={selType} checked={isSelected} readOnly />
            </td>
          )}
          <td className={styles.proof_instance_id}>
            <Link href={`${paths.proof__proof_instances}/${val.id}`}>{val.id as any}</Link>
          </td>
          <td className={styles.proof_type_id}>
            <Link href={`${paths.proof__proof_types}/${val.proof_type_id}`}>
              {val.proof_type_id}
            </Link>
          </td>
          <td className={styles.public_inputs}>{shortPublicInputs}</td>
          <td className={styles.createdAt}>{val.created_at}</td>
        </TableRow>
      );

      rows.push(row);
    }

    return rows;
  }, [data]);

  return (
    <div>
      <TableSearch>
        <input placeholder={i18n.proof_instance_search_guide} />
      </TableSearch>
      <Table>
        <TableHeader>
          <TableRow>
            {handleSelectVal && <th className={styles.radio}></th>}
            <th className={styles.proof_instance_id}>{i18n.proof_instance_id}</th>
            <th className={styles.proof_type_id}>{i18n.proof_type_id}</th>
            <th className={styles.public_inputs}>{i18n.public_inputs}</th>
            <th className={styles.createdAt}>{i18n.created_at}</th>
          </TableRow>
        </TableHeader>
        <TableBody>{rowsElem}</TableBody>
      </Table>
    </div>
  );
};

export default ProofInstanceTable;

export interface ProofInstanceTableProps {
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsProofInstance;
  handleSelectVal?: (row: PrfsProofInstance) => void;
}
