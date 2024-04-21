"use client";

import React from "react";
import cn from "classnames";
import { useRerender } from "@taigalabs/prfs-react-lib/src/hooks/use_rerender";
import { prfsApi3 } from "@taigalabs/prfs-api-js";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";

import styles from "./Set.module.scss";
import { i18nContext } from "@/i18n/context";
import SetElementTable from "@/components/set_element_table/SetElementTable";
import { AppHeader, AppHeaderRow, AppTitle } from "@/components/app_components/AppComponents";
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

  return prfsSet ? (
    <>
      <AppHeader className={styles.header}>
        <AppHeaderRow>
          <AppTitle className={styles.title}>
            {prfsSet.label} ({set_id})
          </AppTitle>
        </AppHeaderRow>
        <AppHeaderRow className={styles.headerRow}>
          <ul className={styles.topMenu}>
            <li>
              <ImportSetElementsDialog rerender={rerender} prfsSet={prfsSet} />
            </li>
            <li>
              <CreateTreeDialog rerender={rerender} set_id={set_id} />
            </li>
          </ul>
          <LatestTree set_id={set_id} nonce={nonce} />
        </AppHeaderRow>
      </AppHeader>
      <div className={styles.table}>
        <SetElementTable setId={set_id} nonce={nonce} />
      </div>
    </>
  ) : (
    <Spinner />
  );
};

export default Set;

export interface SetProps {
  set_id: string;
}
