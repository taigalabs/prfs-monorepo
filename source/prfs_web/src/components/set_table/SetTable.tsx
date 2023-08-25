"use client";

import React from "react";
import Link from "next/link";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import Table, {
  TableBody,
  TableHeader,
  TableRecordData,
  TableRow,
  TableData,
  TableSearch,
} from "@taigalabs/prfs-react-components/src/table/Table";
import dayjs from "dayjs";

import styles from "./SetTable.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const SetTable: React.FC<SetTableProps> = ({ selectType, selectedVal, handleSelectVal }) => {
  const i18n = React.useContext(i18nContext);
  const [data, setData] = React.useState<TableData<PrfsSet>>({ page: 0, values: [] });

  const handleChangePage = React.useCallback(async (page: number) => {
    return prfsApi
      .getSets({
        page_idx: page,
        page_size: 20,
      })
      .then(resp => {
        const { page, prfs_sets } = resp.payload;
        return {
          page,
          values: prfs_sets,
        };
      });
  }, []);

  React.useEffect(() => {
    Promise.resolve(handleChangePage(0)).then(res => {
      setData(res);
    });
  }, [setData, handleChangePage]);

  const rowsElem = React.useMemo(() => {
    // console.log(1, data);
    let { page, values } = data;

    let rows: React.ReactNode[] = [];
    if (values === undefined || values.length < 1) {
      return rows;
    }

    for (let val of values) {
      const onClickRow = handleSelectVal
        ? () => {
            handleSelectVal(val);
          }
        : undefined;

      const isSelected = selectedVal && selectedVal.set_id === val.set_id;
      const selType = selectType || "radio";

      const createdAt = dayjs(val.created_at).format("YYYY-MM-DD");

      let row = (
        <TableRow key={val.set_id} onClickRow={onClickRow} isSelected={isSelected}>
          {handleSelectVal && (
            <td className={styles.select}>
              <div>
                <input type={selType} checked={isSelected} readOnly />
              </div>
            </td>
          )}
          <td className={styles.set_id}>
            <Link href={`${paths.proof__sets}/${val.set_id}`}>{val.set_id}</Link>
          </td>
          <td className={styles.label}>{val.label}</td>
          <td className={styles.desc}>{val.desc}</td>
          <td className={styles.cardinality}>{val.cardinality.toString()}</td>
          <td className={styles.createdAt}>{createdAt}</td>
        </TableRow>
      );

      rows.push(row);
    }

    return rows;
  }, [data, handleSelectVal, selectedVal]);

  return (
    <div>
      <TableSearch>
        <input placeholder={i18n.set_search_guide} />
      </TableSearch>
      <Table>
        <TableHeader>
          <TableRow>
            {handleSelectVal && <th className={styles.select}></th>}
            <th className={styles.set_id}>{i18n.set_id}</th>
            <th className={styles.label}>{i18n.label}</th>
            <th className={styles.desc}>{i18n.description}</th>
            <th className={styles.cardinality}>{i18n.cardinality}</th>
            <th className={styles.createdAt}>{i18n.created_at}</th>
            <th></th>
          </TableRow>
        </TableHeader>
        <TableBody>{rowsElem}</TableBody>
      </Table>
    </div>
  );
};

export default SetTable;

export interface SetTableProps {
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsSet;
  handleSelectVal?: (row: PrfsSet) => void;
}
