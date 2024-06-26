import React from "react";
import cn from "classnames";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { GetPrfsAtstGroupsRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsAtstGroupsRequest";
import { atstApi } from "@taigalabs/prfs-api-js";
import { PrfsAtstGroup } from "@taigalabs/prfs-entities/bindings/PrfsAtstGroup";

import styles from "./AtstGroupModal.module.scss";
import { useI18N } from "@/i18n/use_i18n";
import { GetPrfsAtstGroupsByGroupTypeRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsAtstGroupsByGroupTypeRequest";

const AtstGroupModal: React.FC<AtstGroupModalProps> = ({ handleSelectGroup, setIsOpen }) => {
  const i18n = useI18N();
  const { data, isFetching, error } = useQuery({
    queryKey: ["get_prfs_atst_groups"],
    queryFn: async () => {
      const req: GetPrfsAtstGroupsByGroupTypeRequest = {
        group_type: "group_member_v1",
        offset: 0,
      };
      return atstApi({ type: "get_prfs_atst_groups_by_group_type", ...req });
    },
  });

  const elems = React.useMemo(() => {
    if (data?.payload) {
      if (data.payload.rows.length < 1) {
        return <div className={styles.entry}>No record</div>;
      }

      return data.payload.rows.map(r => {
        const extendedHandleSelectGroup = () => {
          handleSelectGroup(r);
          setIsOpen(false);
        };

        return (
          <div key={r.atst_group_id} className={styles.entry} onClick={extendedHandleSelectGroup}>
            {r.label}
          </div>
        );
      });
    } else {
      return null;
    }
  }, [data, handleSelectGroup, setIsOpen]);

  return <div className={styles.wrapper}>{elems}</div>;
};

export default AtstGroupModal;

export interface AtstGroupModalProps {
  handleSelectGroup: (group: PrfsAtstGroup) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
