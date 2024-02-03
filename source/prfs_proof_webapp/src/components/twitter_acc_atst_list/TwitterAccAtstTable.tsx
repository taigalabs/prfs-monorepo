import React from "react";
import cn from "classnames";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { atstApi } from "@taigalabs/prfs-api-js";
import { i18nContext } from "@/i18n/context";
import { PrfsAccAtst } from "@taigalabs/prfs-entities/bindings/PrfsAccAtst";
import { BiLinkExternal } from "@react-icons/all-files/bi/BiLinkExternal";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import styles from "./TwitterAccAtstTable.module.scss";
import { paths } from "@/paths";
import {
  AttestationTableBody,
  AttestationTableHeader,
  AttestationTableHeaderCell,
  AttestationTableRow,
  AttestationTableBodyInner,
  AttestationTableCell,
  AttestationLoading,
} from "@/components/attestations_table/AttestationsTable";

const AtstRow: React.FC<AtstRowProps> = ({ atst, style, router }) => {
  const i18n = React.useContext(i18nContext);
  const cm = React.useMemo(() => {
    return `${atst.cm.substring(0, 26)}...`;
  }, [atst.cm]);
  const handleClick = React.useCallback(() => {
    router.push(`${paths.attestations__twitter}/${atst.acc_atst_id}`);
  }, [atst.acc_atst_id, router]);

  return (
    <AttestationTableRow style={style} handleClick={handleClick}>
      <AttestationTableCell className={cn(styles.username)}>
        <img src={atst.avatar_url} crossOrigin="" />
        <span>{atst.username}</span>
      </AttestationTableCell>
      <AttestationTableCell className={cn(styles.accountId, styles.w1024)}>
        {atst.account_id}
      </AttestationTableCell>
      <AttestationTableCell className={cn(styles.commitment, styles.w1320)}>
        {cm}
      </AttestationTableCell>
      <AttestationTableCell className={cn(styles.document, styles.cell, styles.w480)}>
        <a href={atst.document_url} target="_blank">
          <span>{i18n.tweet}</span>
          <BiLinkExternal />
        </a>
      </AttestationTableCell>
      <AttestationTableCell className={cn(styles.notarized, styles.w1320)}>
        {i18n.not_available}
      </AttestationTableCell>
      <AttestationTableCell className={cn(styles.onChain, styles.w1320)}>
        {i18n.not_available}
      </AttestationTableCell>
    </AttestationTableRow>
  );
};

const TwitterAccAtstTable: React.FC<TwitterAccAtstTableProps> = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["get_twitter_acc_atsts"],
      queryFn: async ({ pageParam }) => {
        return atstApi("get_twitter_acc_atsts", { offset: pageParam as number });
      },
      initialPageParam: 0,
      getNextPageParam: lastPage => {
        if (lastPage.payload) {
          return lastPage.payload.next_offset;
        } else {
          return null;
        }
      },
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
        <AttestationLoading>Loading...</AttestationLoading>
      ) : status === "error" ? (
        <AttestationLoading>Error: {(error as Error).message}</AttestationLoading>
      ) : (
        <>
          <AttestationTableHeader
            className={cn({
              [styles.noData]: rowVirtualizer.getVirtualItems().length === 0,
            })}
          >
            <AttestationTableHeaderCell className={cn(styles.username)}>
              {i18n.username}
            </AttestationTableHeaderCell>
            <AttestationTableHeaderCell className={cn(styles.accountId, styles.w1024)}>
              {i18n.account_id}
            </AttestationTableHeaderCell>
            <AttestationTableHeaderCell className={cn(styles.commitment, styles.w1320)}>
              {i18n.commitment}
            </AttestationTableHeaderCell>
            <AttestationTableHeaderCell className={cn(styles.document, styles.w480)}>
              {i18n.document}
            </AttestationTableHeaderCell>
            <AttestationTableHeaderCell className={cn(styles.notarized, styles.w1320)}>
              {i18n.notarized}
            </AttestationTableHeaderCell>
            <AttestationTableHeaderCell className={cn(styles.onChain, styles.w1320)}>
              {i18n.on_chain}
            </AttestationTableHeaderCell>
          </AttestationTableHeader>
          <AttestationTableBody innerRef={parentRef}>
            <AttestationTableBodyInner
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
            </AttestationTableBodyInner>
          </AttestationTableBody>
        </>
      )}
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
