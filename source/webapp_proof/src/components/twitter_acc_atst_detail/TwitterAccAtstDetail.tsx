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
  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery<PrfsApiResponse<GetTwitterAccAtstsResponse>>({
      queryKey: ["projects"],
      queryFn: async ({ pageParam }) => {
        console.log("pageParam", pageParam);
        return atstApi("get_twitter_acc_atsts", { offset: pageParam as number });
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage: any) => lastPage.nextId ?? undefined,
    });

  const allRows = data
    ? data.pages.flatMap(d => {
        return d.payload ? d.payload.rows : [];
      })
    : [];
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 5,
  });

  React.useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (lastItem.index >= allRows.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allRows.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  return <div className={styles.wrapper}>power</div>;
};

export default TwitterAccAtstDetail;

export interface TwitterAccAtstDetailProps {}
