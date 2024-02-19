"use client";

import React from "react";
import cn from "classnames";
import { useRerender } from "@taigalabs/prfs-react-lib/src/hooks/use_rerender";

import styles from "./Set.module.scss";
import { i18nContext } from "@/i18n/context";
import SetElementTable from "./SetElementTable";
import {
  AttestationsHeader,
  AttestationsHeaderRow,
  AttestationsTitle,
} from "@/components/attestations/AttestationComponents";
import ImportSetElementsDialog from "./ImportSetElementsDialog";
import CreateTreeDialog from "./CreateTreeDialog";
import LatestTree from "./LatestTree";

const Set: React.FC<SetProps> = ({ set_id }) => {
  const i18n = React.useContext(i18nContext);
  const { nonce, rerender } = useRerender();

  return (
    <>
      <AttestationsHeader>
        <AttestationsHeaderRow>
          <AttestationsTitle className={styles.title}>{i18n.crypto_holders}</AttestationsTitle>
        </AttestationsHeaderRow>
        <AttestationsHeaderRow className={styles.headerRow}>
          <ul className={styles.topMenu}>
            <li>
              <ImportSetElementsDialog rerender={rerender} />
            </li>
            <li>
              <CreateTreeDialog rerender={rerender} />
            </li>
          </ul>
          <LatestTree set_id={set_id} />
        </AttestationsHeaderRow>
      </AttestationsHeader>
      <div>
        <SetElementTable setId={set_id} nonce={nonce} />
      </div>
    </>
  );
};

export default Set;

export interface SetProps {
  set_id: string;
}
