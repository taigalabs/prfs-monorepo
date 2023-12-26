import React from "react";
import cn from "classnames";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { GetTwitterAccAtstsResponse } from "@taigalabs/prfs-entities/bindings/GetTwitterAccAtstsResponse";
import { PrfsApiResponse, atstApi } from "@taigalabs/prfs-api-js";
import { i18nContext } from "@/i18n/context";
import { PrfsAccAtst } from "@taigalabs/prfs-entities/bindings/PrfsAccAtst";
import { BiLinkExternal } from "@react-icons/all-files/bi/BiLinkExternal";
import { useRouter } from "next/navigation";

import styles from "./TwitterAccAtstTable.module.scss";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { paths } from "@/paths";

const AtstRow: React.FC<AtstRowProps> = ({ atst, style, router }) => {
  const i18n = React.useContext(i18nContext);
  const cm = React.useMemo(() => {
    return `${atst.cm.substring(0, 26)}...`;
  }, [atst.cm]);
  const handleClick = React.useCallback(() => {
    router.push(`${paths.attestations__twitter}/${atst.acc_atst_id}`);
  }, [atst.acc_atst_id, router]);

  return (
    <div className={cn(styles.row)} style={style} onClick={handleClick}>
      <div className={cn(styles.username, styles.cell)}>
        <img src={atst.avatar_url} crossOrigin="" />
        <span>{atst.username}</span>
      </div>
      <div className={cn(styles.accountId, styles.cell, styles.w1120)}>{atst.account_id}</div>
      <div className={cn(styles.commitment, styles.cell, styles.w1120)}>{cm}</div>
      <div className={cn(styles.document, styles.cell, styles.w480)}>
        <a href={atst.document_url} target="_blank">
          <span>{i18n.tweet}</span>
          <BiLinkExternal />
        </a>
      </div>
      <div className={cn(styles.notarized, styles.cell, styles.w1320)}>{i18n.not_available}</div>
      <div className={cn(styles.onChain, styles.cell, styles.w1320)}>{i18n.not_available}</div>
    </div>
  );
};

const TwitterAccAtstTable: React.FC<TwitterAccAtstTableProps> = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery<PrfsApiResponse<GetTwitterAccAtstsResponse>>({
      queryKey: ["projects"],
      queryFn: async ({ pageParam }) => {
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

  return (
    <div className={styles.wrapper}>
      {status === "pending" ? (
        <p>Loading...</p>
      ) : status === "error" ? (
        <span>Error: {(error as Error).message}</span>
      ) : (
        <>
          <div
            className={cn(styles.header, {
              [styles.noData]: rowVirtualizer.getVirtualItems().length === 0,
            })}
          >
            <div className={cn(styles.username, styles.headerCell)}>{i18n.username}</div>
            <div className={cn(styles.accountId, styles.headerCell, styles.w1120)}>
              {i18n.account_id}
            </div>
            <div className={cn(styles.commitment, styles.headerCell, styles.w1120)}>
              {i18n.commitment}
            </div>
            <div className={cn(styles.document, styles.headerCell, styles.w480)}>
              {i18n.document}
            </div>
            <div className={cn(styles.notarized, styles.headerCell, styles.w1320)}>
              {i18n.notarized}
            </div>
            <div className={cn(styles.onChain, styles.headerCell, styles.w1320)}>
              {i18n.on_chain}
            </div>
          </div>
          <div className={styles.listContainer} ref={parentRef}>
            <div
              className={styles.listInner}
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
              }}
            >
              {rowVirtualizer.getVirtualItems().map(virtualRow => {
                const isLoaderRow = virtualRow.index > allRows.length - 1;
                const row = allRows[virtualRow.index];

                if (isLoaderRow) {
                  return hasNextPage ? <div>Loading more...</div> : null;
                }

                return (
                  <AtstRow
                    key={virtualRow.index}
                    atst={row}
                    router={router}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}
      <div>{isFetching && !isFetchingNextPage ? "Background Updating..." : null}</div>
    </div>
  );
};

export default TwitterAccAtstTable;

export interface TwitterAccAtstTableProps {}

export interface AtstRowProps {
  atst: PrfsAccAtst;
  style: React.CSSProperties;
  router: AppRouterInstance;
}
