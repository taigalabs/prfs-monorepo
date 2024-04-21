import React from "react";
import cn from "classnames";
import { useInfiniteQuery } from "@taigalabs/prfs-react-lib/react_query";
import { useVirtualizer } from "@taigalabs/prfs-react-lib/react_virtual";
import { treeApi } from "@taigalabs/prfs-api-js";
import { useRouter } from "next/navigation";

import styles from "./SetElementTable.module.scss";
import {
  AppTableBody,
  AppTableBodyInner,
  AppTableWrapper,
  AppTableLoading,
} from "@/components/app_table_components/AppTableComponents";
import SetElementTableRow, { SetElementTableHeaderRow } from "./SetElementTableRow";
import { useI18N } from "@/i18n/use_i18n";

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
  const i18n = useI18N();
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
        <AppTableLoading>Loading...</AppTableLoading>
      ) : status === "error" ? (
        <span>Error: {(error as Error).message}</span>
      ) : (
        <>
          <SetElementTableHeaderRow />
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
