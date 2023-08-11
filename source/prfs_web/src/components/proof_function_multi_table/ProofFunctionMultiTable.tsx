import React from "react";
import Link from "next/link";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import { ProofFunctionDefinition } from "@taigalabs/prfs-entities/bindings/ProofFunctionDefinition";

import styles from "./CircuitTable.module.scss";
import Table, {
  TableBody,
  TableRow,
  TableHeader,
  TableData,
  TableRecordData,
} from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";

const ProofFunctionMultiTable: React.FC<ProofFunctionMultiTableProps> = ({
  proof_functions,
  selectType,
  selectedVal,
  handleSelectVal,
}) => {
  const i18n = React.useContext(i18nContext);
  // const [data, setData] = React.useState<TableRecordData<Record<any, ProofFunctionDefinition>>>({
  //   record: proof_functions,
  // });

  // React.useEffect(() => {
  //   setData({ record: proof_functions });
  // }, [setData, proof_functions]);

  console.log(11, proof_functions);

  const tablesElem = React.useMemo(() => {
    const elems: React.ReactNode[] = [];

    if (proof_functions === undefined) {
      return elems;
    }

    proof_functions.map(proof_function => {
      let elem = <div key={proof_function.label}>{proof_function.label}</div>;
      elems.push(elem);
    });

    return elems;
  }, [proof_functions]);

  return <div>{tablesElem}</div>;

  // return (
  //   <Table minWidth={880}>
  //     <TableHeader>
  //       <TableRow>
  //         {handleSelectVal && <th className={styles.radio}></th>}
  //         <th className={styles.circuit_id}>{i18n.circuit_id}</th>
  //         <th className={styles.label}>{i18n.label}</th>
  //         <th className={styles.desc}>{i18n.description}</th>
  //         <th className={styles.author}>{i18n.author}</th>
  //         <th className={styles.createdAt}>{i18n.created_at}</th>
  //       </TableRow>
  //     </TableHeader>
  //     <TableBody>{rowsElem}</TableBody>
  //   </Table>
  // );
};

export default ProofFunctionMultiTable;

export interface ProofFunctionMultiTableProps {
  proof_functions: ProofFunctionDefinition[];
  selectType?: "checkbox" | "radio";
  selectedVal?: PrfsCircuit;
  handleSelectVal?: (row: PrfsCircuit) => void;
}
