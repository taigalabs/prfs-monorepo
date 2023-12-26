"use client";

import React from "react";
import cn from "classnames";
import { GetTwitterAccAtstsResponse } from "@taigalabs/prfs-entities/bindings/GetTwitterAccAtstsResponse";
import { PrfsApiResponse, atstApi } from "@taigalabs/prfs-api-js";
import { i18nContext } from "@/i18n/context";
import { useQuery } from "@tanstack/react-query";
import { PrfsAccAtst } from "@taigalabs/prfs-entities/bindings/PrfsAccAtst";

import styles from "./AccAtstDetail.module.scss";

// const AtstRow: React.FC<AtstRowProps> = ({ atst, style }) => {
//   const i18n = React.useContext(i18nContext);
//   return (
//     <div className={cn(styles.row)} style={style}>
//       <div className={cn(styles.username, styles.cell)}>{atst.username}</div>
//       <div className={cn(styles.accountId, styles.cell)}>{atst.account_id}</div>
//       <div className={cn(styles.commitment, styles.cell)}>{atst.cm}</div>
//       <div className={cn(styles.url, styles.cell)}>{i18n.tweet}</div>
//     </div>
//   );
// };

const AccAtstDetail: React.FC<AccAtstDetailProps> = ({ acc_atst_id }) => {
  const i18n = React.useContext(i18nContext);
  const { isLoading, data, error } = useQuery({
    queryKey: ["get_twitter_acc_atst"],
    queryFn: async () => {
      const { payload } = await atstApi("get_twitter_acc_atst", {
        acc_atst_id,
      });
      return payload;
    },
  });

  if (isLoading) {
    <div>Loading...</div>;
  }

  if (error) {
    <div>Fetch error: {error.toString()}</div>;
  }

  const atst = data?.prfs_acc_atst;

  return (
    atst && (
      <div className={styles.wrapper}>
        <div className={cn(styles.username, styles.cell)}>{atst.username}</div>
        <div className={cn(styles.accountId, styles.cell)}>{atst.account_id}</div>
        <div className={cn(styles.commitment, styles.cell)}>{atst.cm}</div>
        <div className={cn(styles.url, styles.cell)}>{i18n.tweet}</div>
      </div>
    )
  );
};

export default AccAtstDetail;

export interface AccAtstDetailProps {
  acc_atst_id: string;
}
