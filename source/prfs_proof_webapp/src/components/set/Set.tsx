"use client";

import React from "react";
import cn from "classnames";
import { useRerender } from "@taigalabs/prfs-react-lib/src/hooks/use_rerender";
import { prfsApi3 } from "@taigalabs/prfs-api-js";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";

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

  const { data, isFetching, error } = useQuery({
    queryKey: ["get_prfs_set", set_id],
    queryFn: async () => {
      return prfsApi3({ type: "get_prfs_set_by_set_id", set_id: set_id });
    },
  });

  const prfsSet = data?.payload?.prfs_set;

  return (
    <>
      <AttestationsHeader className={styles.header}>
        <AttestationsHeaderRow>
          <AttestationsTitle className={styles.title}>{i18n.crypto_holders}</AttestationsTitle>
        </AttestationsHeaderRow>
        <AttestationsHeaderRow className={styles.headerRow}>
          {isFetching && <Spinner />}
          {prfsSet && (
            <ul className={styles.topMenu}>
              <li>
                <ImportSetElementsDialog rerender={rerender} prfsSet={prfsSet} />
              </li>
              <li>
                <CreateTreeDialog rerender={rerender} />
              </li>
            </ul>
          )}
          <LatestTree set_id={set_id} nonce={nonce} />
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
