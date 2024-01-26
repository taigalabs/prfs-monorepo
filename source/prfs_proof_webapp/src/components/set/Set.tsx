"use client";

import React from "react";
import cn from "classnames";

import styles from "./Set.module.scss";
import { i18nContext } from "@/i18n/context";
import SetElementTable from "./SetElementTable";
import {
  AttestationsHeader,
  AttestationsHeaderRow,
  AttestationsTitle,
} from "@/components/attestations/AttestationComponents";
import ImportSetElementsDialog from "./ImportSetElementsDialog";

const Set: React.FC<SetProps> = ({ set_id }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <>
      <AttestationsHeader>
        <AttestationsHeaderRow>
          <AttestationsTitle className={styles.title}>{i18n.crypto_holders}</AttestationsTitle>
        </AttestationsHeaderRow>
        <AttestationsHeaderRow>
          <ul>
            <li>
              <ImportSetElementsDialog />
            </li>
          </ul>
        </AttestationsHeaderRow>
      </AttestationsHeader>
      <div>
        <SetElementTable setId={set_id} />
      </div>
    </>
  );
};

export default Set;

export interface SetProps {
  set_id: string;
}
