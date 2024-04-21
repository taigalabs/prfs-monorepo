import React from "react";
import cn from "classnames";
import { useInfiniteQuery } from "@taigalabs/prfs-react-lib/react_query";
import { useVirtualizer } from "@taigalabs/prfs-react-lib/react_virtual";
import { treeApi } from "@taigalabs/prfs-api-js";
import { i18nContext } from "@/i18n/context";
import { PrfsSetElement } from "@taigalabs/prfs-entities/bindings/PrfsSetElement";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import styles from "./SetElementTable.module.scss";
import {
  AppTableBody,
  AppTableHeader,
  AppTableRow,
  AppTableBodyInner,
  AppTableWrapper,
} from "@/components/app_table_components/AppTableComponents";
import {
  AppTableHeaderCell,
  AppTableCell,
} from "@/components/app_table_components/AppTableCellComponents";
import { paths } from "@/paths";
import SetElementTableRow from "./SetElementTableRow";

function fetchPrfsSetElements(set_id: string, nonce: number) {
  return useInfiniteQuery({
    queryKey: ["get_prfs_set_elements", nonce],
    queryFn: async ({ pageParam }) => {
      return treeApi({ type: "get_prfs_set_elements", offset: pageParam as number, set_id });
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

const SetElementTable: React.FC<SetElementTableProps> = ({ setId, nonce }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const { status, data, error, isFetchingNextPage, fetchNextPage, hasNextPage } =
    fetchPrfsSetElements(setId, nonce);

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
    <AppTableWrapper>
      {status === "pending" ? (
        <p className={styles.loading}>Loading...</p>
      ) : status === "error" ? (
        <span>Error: {(error as Error).message}</span>
      ) : (
        <>
          <AppTableHeader
            className={cn({
              [styles.noData]: rowVirtualizer.getVirtualItems().length === 0,
            })}
          >
            <AppTableHeaderCell className={cn(styles.name)} alwaysRender>
              {i18n.name}
            </AppTableHeaderCell>
            <AppTableHeaderCell className={cn(styles.data)} w1024>
              {i18n.data}
            </AppTableHeaderCell>
            <AppTableHeaderCell className={cn(styles.ref)} w1280>
              {i18n.ref}
            </AppTableHeaderCell>
            <AppTableHeaderCell className={cn(styles.ref)} flexGrow />
          </AppTableHeader>
          <AppTableBody innerRef={parentRef}>
            <AppTableBodyInner
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
              }}
            >
              {rowVirtualizer.getVirtualItems().map(virtualRow => {
                const isLoaderRow = virtualRow.index > allRows.length - 1;
                const row = allRows[virtualRow.index];

                if (isLoaderRow) {
                  return hasNextPage ? <div key={virtualRow.key}>Loading more...</div> : null;
                }

                return (
                  <SetElementTableRow
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
            </AppTableBodyInner>
          </AppTableBody>
        </>
      )}
    </AppTableWrapper>
  );
};

export default SetElementTable;

export interface SetElementTableProps {
  setId: string;
  nonce: number;
}
