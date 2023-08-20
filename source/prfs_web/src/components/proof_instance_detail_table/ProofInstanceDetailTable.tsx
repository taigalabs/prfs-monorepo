import React from "react";
import Link from "next/link";
import cn from "classnames";
import { useRouter } from "next/navigation";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import Table, {
  TableBody,
  TableHeader,
  TableRecordData,
  TableRow,
} from "@taigalabs/prfs-react-components/src/table/Table";
import { AiOutlineCheck } from "react-icons/ai";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import { PrfsProofInstance } from "@taigalabs/prfs-entities/bindings/PrfsProofInstance";

import styles from "./ProofInstanceDetailTable.module.scss";
import { i18nContext } from "@/contexts/i18n";
import dayjs from "dayjs";

const ProofInstanceDetailTable: React.FC<ProofInstanceDetailTableProps> = ({ proofInstance }) => {
  const i18n = React.useContext(i18nContext);

  const [data, setData] = React.useState<TableRecordData<PrfsProofInstanceSyn1 | undefined>>({
    record: proofInstance,
  });

  const rowsElem = React.useMemo(() => {
    let { record } = data;

    let rows: React.ReactNode[] = [];
    if (record === undefined || Object.keys(record).length < 1) {
      return rows;
    }

    const createdAt = dayjs(record.created_at).format("YYYY-MM-DD");

    return (
      <TableBody>
        <TableRow>
          <td className={styles.label}>{i18n.id}</td>
          <td className={styles.value}>{record.id as unknown as number}</td>
        </TableRow>
        <TableRow>
          <td className={styles.label}>{i18n.proof_type_id}</td>
          <td className={styles.value}>{record.proof_type_id}</td>
        </TableRow>
        <TableRow>
          <td className={styles.label}>{i18n.verified}</td>
          <td className={cn(styles.value, styles.verified)}>
            <div className={styles.cell}>
              <AiOutlineCheck />
            </div>
          </td>
        </TableRow>
        <TableRow>
          <td className={styles.label}>{i18n.created_at}</td>
          <td className={styles.value}>{createdAt}</td>
        </TableRow>
      </TableBody>
    );
  }, [data]);

  return <Table>{rowsElem}</Table>;
};

export default ProofInstanceDetailTable;

export interface ProofInstanceDetailTableProps {
  proofInstance: PrfsProofInstanceSyn1 | undefined;
}
