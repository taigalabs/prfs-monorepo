import React from "react";
import cn from "classnames";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { GetTwitterAccAtstsResponse } from "@taigalabs/prfs-entities/bindings/GetTwitterAccAtstsResponse";
import { PrfsApiResponse, atstApi } from "@taigalabs/prfs-api-js";
import { i18nContext } from "@/i18n/context";

import styles from "./TwitterAccAtstDetail.module.scss";
import { PrfsAccAtst } from "@taigalabs/prfs-entities/bindings/PrfsAccAtst";

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

const TwitterAccAtstDetail: React.FC<TwitterAccAtstDetailProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      {/* <div className={cn(styles.username, styles.cell)}>{atst.username}</div> */}
      {/* <div className={cn(styles.accountId, styles.cell)}>{atst.account_id}</div> */}
      {/* <div className={cn(styles.commitment, styles.cell)}>{atst.cm}</div> */}
      {/* <div className={cn(styles.url, styles.cell)}>{i18n.tweet}</div> */}
    </div>
  );
};

export default TwitterAccAtstDetail;

export interface TwitterAccAtstDetailProps {}
