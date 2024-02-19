import React from "react";
import cn from "classnames";
import { prfsApi3 } from "@taigalabs/prfs-api-js";
import { useQuery } from "@tanstack/react-query";

import styles from "./LatestTree.module.scss";
import { useI18N } from "@/i18n/use_i18n";
import { abbrev5and5 } from "@taigalabs/prfs-ts-utils";

const LatestTree: React.FC<SetProps> = ({ set_id, nonce }) => {
  const i18n = useI18N();
  const { isFetching, data, error } = useQuery({
    queryKey: ["get_latest_tree_by_set_id", set_id, nonce],
    queryFn: async () => {
      return prfsApi3({
        type: "get_latest_prfs_tree_by_set_id",
        set_id,
      });
    },
  });

  const elem = React.useMemo(() => {
    if (data?.payload?.prfs_tree) {
      const { tree_id, merkle_root } = data.payload.prfs_tree;
      const treeId = abbrev5and5(tree_id);
      const merkleRoot = abbrev5and5(merkle_root);

      return (
        <ul className={styles.list}>
          <li className={styles.item}>
            <p>{i18n.tree_id}</p>
            <p>{treeId}</p>
          </li>
          <li className={styles.item}>
            <p>{i18n.merkle_root}</p>
            <p>{merkleRoot}</p>
          </li>
        </ul>
      );
    }

    return <div>{i18n.no_tree_has_been_made}</div>;
  }, [data]);

  return (
    <div className={styles.wrapper}>
      {isFetching && <span>{i18n.loading}...</span>}
      <div>{elem}</div>
    </div>
  );
};

export default LatestTree;

export interface SetProps {
  set_id: string;
  nonce: number;
}
