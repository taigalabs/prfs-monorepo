import React from "react";
import cn from "classnames";
import { prfsApi3, treeApi } from "@taigalabs/prfs-api-js";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { abbrev7and5, abbrevMandN } from "@taigalabs/prfs-ts-utils";
import Tooltip from "@taigalabs/prfs-react-lib/src/tooltip/Tooltip";

import styles from "./LatestTree.module.scss";
import { useI18N } from "@/i18n/use_i18n";

const LatestTree: React.FC<SetProps> = ({ set_id, nonce }) => {
  const i18n = useI18N();
  const { isFetching, data, error } = useQuery({
    queryKey: ["get_latest_tree_by_set_id", set_id, nonce],
    queryFn: async () => {
      return treeApi({
        type: "get_latest_prfs_tree_by_set_id",
        set_id,
      });
    },
  });

  const elem = React.useMemo(() => {
    if (data?.payload?.prfs_tree) {
      const { tree_id, merkle_root } = data.payload.prfs_tree;
      const treeId = abbrev7and5(tree_id);
      const merkleRoot = abbrevMandN(merkle_root, 5, 5);

      return (
        <ul className={styles.list}>
          <li className={styles.item}>
            <p className={styles.title}>{i18n.latest_tree_id}</p>
            <Tooltip label={tree_id}>
              <p>{treeId}</p>
            </Tooltip>
          </li>
          <li className={styles.item}>
            <p className={styles.title}>{i18n.merkle_root}</p>
            <p>{merkleRoot}</p>
          </li>
        </ul>
      );
    }

    return <div className={styles.list}>{i18n.no_tree_has_been_made}</div>;
  }, [data]);

  return (
    <div className={styles.wrapper}>
      {isFetching && <span>{i18n.loading}...</span>}
      {elem}
    </div>
  );
};

export default LatestTree;

export interface SetProps {
  set_id: string;
  nonce: number;
}
