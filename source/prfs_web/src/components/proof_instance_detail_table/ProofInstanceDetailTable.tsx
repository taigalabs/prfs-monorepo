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
import { AiFillCheckCircle, AiOutlineCopy } from "react-icons/ai";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import { BsFillCheckCircleFill } from "react-icons/bs";
import dayjs from "dayjs";

import styles from "./ProofInstanceDetailTable.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Popover from "@taigalabs/prfs-react-components/src/popover/Popover";

const ProofInstanceDetailTable: React.FC<ProofInstanceDetailTableProps> = ({ proofInstance }) => {
  const i18n = React.useContext(i18nContext);

  const [data, _] = React.useState<TableRecordData<PrfsProofInstanceSyn1>>({
    record: proofInstance,
  });

  const url = React.useMemo(() => {
    return `${process.env.NEXT_PUBLIC_PRFS_WEB_ENDPOINT}/p/${proofInstance.short_id}`;
  }, [proofInstance]);

  const handleClickCopy = React.useCallback(() => {
    navigator.clipboard.writeText(url);
  }, [url]);

  const createCopyButton = React.useCallback(
    (_: boolean) => {
      return (
        <button onClick={handleClickCopy}>
          <AiOutlineCopy />
        </button>
      );
    },
    [url]
  );

  const createCopyButtonTooltip = React.useCallback(
    (setIsOpen: React.Dispatch<React.SetStateAction<any>>) => {
      return <div>URL is copied</div>;
    },
    []
  );

  const rowsElem = React.useMemo(() => {
    let { record } = data;

    let rows: React.ReactNode[] = [];
    if (record === undefined || Object.keys(record).length < 1) {
      return rows;
    }

    const createdAt = dayjs(record.created_at).format("YYYY-MM-DD");
    // const url = `${process.env.NEXT_PUBLIC_PRFS_WEB_ENDPOINT}/p/${record.short_id}`;

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
          <td className={styles.label}>{i18n.proof_label}</td>
          <td className={styles.value}>{record.proof_label}</td>
        </TableRow>
        <TableRow>
          <td className={styles.label}>{i18n.share_url}</td>
          <td className={cn(styles.value, styles.url)}>
            <div className={styles.cell}>
              <span>{url}</span>
              <Popover createBase={createCopyButton} createPopover={createCopyButtonTooltip} />
            </div>
          </td>
        </TableRow>
        <TableRow>
          <td className={styles.label}>{i18n.verified}</td>
          <td className={cn(styles.value, styles.verified)}>
            <div className={styles.cell}>
              <BsFillCheckCircleFill />
              <span>{i18n.verified}</span>
            </div>
          </td>
        </TableRow>
        <TableRow>
          <td className={styles.label}>{i18n.created_at}</td>
          <td className={styles.value}>{createdAt}</td>
        </TableRow>
        <TableRow>
          <td className={styles.label}>{i18n.proof_description}</td>
          <td className={styles.value}>{record.proof_desc}</td>
        </TableRow>
        <TableRow>
          <td className={styles.label}>{i18n.proof_type_id}</td>
          <td className={styles.value}>{record.proof_label}</td>
        </TableRow>
        <TableRow>
          <td className={styles.label}>{i18n.driver_id}</td>
          <td className={styles.value}>{record.driver_id}</td>
        </TableRow>
        <TableRow>
          <td className={styles.label}>{i18n.circuit_id}</td>
          <td className={styles.value}>{record.circuit_id}</td>
        </TableRow>
      </TableBody>
    );
  }, [data, url]);

  return <Table>{rowsElem}</Table>;
};

export default ProofInstanceDetailTable;

export interface ProofInstanceDetailTableProps {
  proofInstance: PrfsProofInstanceSyn1;
}
