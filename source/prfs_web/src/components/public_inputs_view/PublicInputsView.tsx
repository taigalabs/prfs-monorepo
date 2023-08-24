import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as prfsApi from "@taigalabs/prfs-api-js";
import Link from "next/link";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import Head from "next/head";
import { AiOutlineCopy } from "react-icons/ai";
import Table, { TableBody, TableRow } from "@taigalabs/prfs-react-components/src/table/Table";

import styles from "./PublicInputsView.module.scss";
import { i18nContext } from "@/contexts/i18n";

const PublicInputsView: React.FC<PublicInputsViewProps> = ({ publicInputs }) => {
  let i18n = React.useContext(i18nContext);

  const valueElem = React.useMemo(() => {
    let elems = [];

    for (const [key, value] of Object.entries(publicInputs)) {
      let elem = (
        <TableRow key={key}>
          <td className={styles.label}>{key}</td>
          <td className={styles.value}>{JSON.stringify(value)}</td>
          <td></td>
        </TableRow>
      );

      elems.push(elem);
    }

    // JSON.stringify(publicInputs);
    return elems;
  }, [publicInputs]);

  return (
    <div className={styles.wrapper}>
      <Table>
        <TableBody>{valueElem}</TableBody>
      </Table>
    </div>
  );
};

export default PublicInputsView;

export interface PublicInputsViewProps {
  publicInputs: Record<string, any>;
}
