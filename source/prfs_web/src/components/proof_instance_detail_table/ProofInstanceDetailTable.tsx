import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
// import { MsgType, PrfsSDK, sendMsgToChild } from "@taigalabs/prfs-sdk-web";
// import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
// import * as prfsApi from "@taigalabs/prfs-api-js";
// import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
// import Button from "@taigalabs/prfs-react-components/src/button/Button";
// import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";

import styles from "./ProofInstanceDetailTable.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { PrfsProofInstance } from "@taigalabs/prfs-entities/bindings/PrfsProofInstance";
import Table, { TableBody, TableHeader, TableRecordData, TableRow } from "../table/Table";

const ProofInstanceDetailTable: React.FC<ProofInstanceDetailTableProps> = ({ proofInstance }) => {
  const i18n = React.useContext(i18nContext);

  const [data, setData] = React.useState<TableRecordData<PrfsProofInstance | undefined>>({
    record: proofInstance,
  });

  const rowsElem = React.useMemo(() => {
    let { record } = data;

    let rows: React.ReactNode[] = [];
    if (record === undefined || Object.keys(record).length < 1) {
      return rows;
    }

    return (
      <TableBody>
        <TableRow>
          <td className={styles.label}>{i18n.proof_instance_id}</td>
          <td className={styles.value}>{record.proof_instance_id}</td>
        </TableRow>
        <TableRow>
          <td className={styles.label}>{i18n.proof_type_id}</td>
          <td className={styles.value}>{record.proof_type_id}</td>
        </TableRow>
        <TableRow>
          <td className={styles.label}>{i18n.signature}</td>
          <td className={styles.value}>
            <div>{record.sig}</div>
          </td>
        </TableRow>
        {/* <TableRow> */}
        {/*   <td className={styles.value}>{i18n.proof_instance_id}</td> */}
        {/*   <td className={styles.label}>{record.proof_instance_id}</td> */}
        {/* </TableRow> */}
      </TableBody>
    );
  }, [data]);

  return <Table minWidth={880}>{rowsElem}</Table>;
};

export default ProofInstanceDetailTable;

export interface ProofInstanceDetailTableProps {
  proofInstance: PrfsProofInstance | undefined;
}
