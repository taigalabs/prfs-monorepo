import React from "react";
import cn from "classnames";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { i18nContext } from "@/i18n/context";
import { PrfsSetElement } from "@taigalabs/prfs-entities/bindings/PrfsSetElement";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import styles from "./SetElementTable.module.scss";
import {
  AttestationTableBody,
  AttestationTableHeader,
  AttestationTableHeaderCell,
  AttestationTableRow,
  AttestationTableBodyInner,
  AttestationTableCell,
} from "@/components/attestations_table/AttestationsTable";

const Row: React.FC<RowProps> = ({ row, style }) => {
  const name = React.useMemo(() => {
    if (row.name.length > 12) {
      return row.name.substring(0, 12) + "...";
    } else {
      row.name;
    }
  }, [row.name]);
  const data = React.useMemo(() => {
    const d = JSON.stringify(row.data);
    if (d.length > 16) {
      return d.substring(0, 16) + "...";
    } else {
      return d;
    }
  }, [row.data]);

  return (
    <AttestationTableRow style={style}>
      <AttestationTableCell className={cn(styles.name)}>
        <span>{name}</span>
      </AttestationTableCell>
      <AttestationTableCell className={cn(styles.data, styles.w1024)}>{data}</AttestationTableCell>
      <AttestationTableCell className={cn(styles.ref, styles.w1320)}>
        {row.ref}
      </AttestationTableCell>
    </AttestationTableRow>
  );
};

function fetchPrfsSetElements(set_id: string) {
  return useInfiniteQuery({
    queryKey: ["get_prfs_set_elements"],
    queryFn: async ({ pageParam }) => {
      return prfsApi2("get_prfs_set_elements", { offset: pageParam as number, set_id });
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
}

const SetElementTable: React.FC<SetElementTableProps> = ({ setId }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const { status, data, error, isFetchingNextPage, fetchNextPage, hasNextPage } =
    fetchPrfsSetElements(setId);

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
          <AttestationTableHeader
            className={cn({
              [styles.noData]: rowVirtualizer.getVirtualItems().length === 0,
            })}
          >
            <AttestationTableHeaderCell className={cn(styles.name)}>
              {i18n.name}
            </AttestationTableHeaderCell>
            <AttestationTableHeaderCell className={cn(styles.data, styles.w1024)}>
              {i18n.data}
            </AttestationTableHeaderCell>
            <AttestationTableHeaderCell className={cn(styles.ref, styles.w1320)}>
              {i18n.ref}
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
                  <Row
                    key={virtualRow.index}
                    row={row}
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

export default SetElementTable;

export interface SetElementTableProps {
  setId: string;
}

export interface RowProps {
  row: PrfsSetElement;
  style: React.CSSProperties;
  router: AppRouterInstance;
}