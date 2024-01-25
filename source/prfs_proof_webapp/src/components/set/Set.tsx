"use client";

import React from "react";
import cn from "classnames";

import styles from "./Set.module.scss";
import { i18nContext } from "@/i18n/context";
import SetTable from "./SetTable";
import {
  AttestationsHeader,
  AttestationsHeaderRow,
  AttestationsTitle,
} from "@/components/attestations/AttestationComponents";
import ImportSetElementsDialog from "./ImportSetElementsDialog";

const Set: React.FC<SetProps> = () => {
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
        <SetTable />
      </div>
    </>
  );
};

export default Set;

export interface SetProps {}
