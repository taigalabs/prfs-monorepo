import React from "react";
import Link from "next/link";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import Table, {
  TableBody,
  TableRow,
  TableHeader,
  TableData,
  TableRecordData,
  TableSearch,
} from "@taigalabs/prfs-react-components/src/table/Table";
import dayjs from "dayjs";

import styles from "./CircuitTable.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const CircuitTable: React.FC<CircuitTableProps> = ({
  selectType,
  selectedVal,
  handleSelectVal,
}) => {
  const i18n = React.useContext(i18nContext);
  const [data, setData] = React.useState<TableData<PrfsCircuit>>({ page: 0, values: [] });

  const handleChangeProofPage = React.useCallback(async (page: number) => {
    return prfsApi
      .getPrfsNativeCircuits({
        page,
      })
      .then(resp => {
        const { page, prfs_circuits_syn1 } = resp.payload;
        return {
          page,
          values: prfs_circuits_syn1,
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

      const isSelected = selectedVal && selectedVal.circuit_id === val.circuit_id;
      const selType = selectType || "radio";

      const createdAt = dayjs(val.created_at).format("YYYY-MM-DD");

      let row = (
        <TableRow key={val.circuit_id} onClickRow={onClickRow} isSelected={isSelected}>
          {selectedVal && (
            <td className={styles.radio}>
              <input type={selType} checked={isSelected} readOnly />
            </td>
          )}
          <td className={styles.circuit_id}>
            <Link href={`${paths.proof__circuits}/${val.circuit_id}`}>{val.circuit_id}</Link>
          </td>
          <td className={styles.label}>{val.label}</td>
          <td className={styles.desc}>{val.desc}</td>
          <td className={styles.author}>{val.author}</td>
          <td className={styles.createdAt}>{createdAt}</td>
        </TableRow>
      );

      rows.push(row);
    }

    return rows;
  }, [data]);

  return (
    <div>
      <TableSearch>
        <input placeholder={i18n.circuit_search_guide} />
      </TableSearch>

      <Table>
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
        <TableBody>{rowsElem}</TableBody>
      </Table>
    </div>
  );
};

export default CircuitTable;

export interface CircuitTableProps {
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsCircuit;
  handleSelectVal?: (row: PrfsCircuit) => void;
}
