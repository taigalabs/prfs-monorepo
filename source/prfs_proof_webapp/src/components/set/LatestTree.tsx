import React from "react";
import cn from "classnames";
import { prfsApi3 } from "@taigalabs/prfs-api-js";
import { useQuery } from "@tanstack/react-query";

import styles from "./LatestTree.module.scss";
import { useI18N } from "@/i18n/use_i18n";

const LatestTree: React.FC<SetProps> = ({ set_id }) => {
  const i18n = useI18N();
  const { isLoading, data, error } = useQuery({
    queryKey: ["get_latest_tree_by_set_id", set_id],
    queryFn: async () => {
      return prfsApi3({
        type: "get_latest_prfs_tree_by_set_id",
        set_id,
      });
    },
  });

  return <div className={styles.wrapper}></div>;
};

export default LatestTree;

export interface SetProps {
  set_id: string;
}
