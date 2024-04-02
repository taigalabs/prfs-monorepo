import React from "react";
import cn from "classnames";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { GetPrfsAtstGroupsRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsAtstGroupsRequest";
import { atstApi } from "@taigalabs/prfs-api-js";

import styles from "./AtstGroupModal.module.scss";
import { useI18N } from "@/i18n/use_i18n";

const AtstGroupModal: React.FC<AtstGroupModalProps> = ({}) => {
  const i18n = useI18N();
  const { data, isFetching, error } = useQuery({
    queryKey: ["get_prfs_atst_groups"],
    queryFn: async () => {
      const req: GetPrfsAtstGroupsRequest = {
        offset: 0,
      };
      return atstApi({ type: "get_prfs_atst_groups", ...req });
    },
  });

  console.log(11, data);

  const elems = React.useMemo(() => {
    if (data?.payload) {
      return data.payload.rows.map(r => {
        return <div key={r.atst_group_id}>{r.label}</div>;
      });
    } else {
      return null;
    }
  }, [data]);

  return <div className={styles.wrapper}>{elems}</div>;
};

export default AtstGroupModal;

export interface AtstGroupModalProps {}
