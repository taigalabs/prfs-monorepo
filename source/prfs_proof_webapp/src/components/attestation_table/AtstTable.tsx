import React from "react";
import cn from "classnames";
import { useInfiniteQuery } from "@taigalabs/prfs-react-lib/react_query";
import { useVirtualizer } from "@taigalabs/prfs-react-lib/react_virtual";
import { atstApi } from "@taigalabs/prfs-api-js";
import { useRouter } from "next/navigation";
import { GetPrfsAttestationsByAtstGroupIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsAttestationsByAtstGroupIdRequest";
import { PrfsAtstGroupId } from "@taigalabs/prfs-entities/bindings/PrfsAtstGroupId";

import styles from "./AtstTable.module.scss";
import {
  AppTableHeader,
  AppTableBody2,
  AppTableWrapper,
} from "@/components/app_table_components/AppTableComponents";
import { AppTableHeaderCell } from "@/components/app_table_components/AppTableCellComponents";
import { useI18N } from "@/i18n/use_i18n";
import AtstTableRow from "./AtstTableRow";

const GroupMemberAtstTable: React.FC<TwitterAccAtstTableProps> = ({ nonce, atst_group_id }) => {
  const i18n = useI18N();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = React.useState(false);

  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["get_prfs_attestations", nonce, atst_group_id],
      queryFn: async ({ pageParam }) => {
        const req: GetPrfsAttestationsByAtstGroupIdRequest = {
          atst_group_id: atst_group_id as PrfsAtstGroupId,
          offset: pageParam as number,
        };
        return atstApi({
          type: "get_prfs_attestations_by_atst_group_id",
          ...req,
        });
        // return fetchServerPage(10, pageParam);
      },
      initialPageParam: 0,
      getNextPageParam: lastPage => {
        if (lastPage.payload) {
          return lastPage.payload.next_offset;
        } else {
          return null;
        }
      },
      // getNextPageParam: (_lastGroup, groups) => groups.length,
    });

  const allRows = data
    ? data.pages.flatMap(d => {
        return d.payload ? d.payload.rows : [];
      })
    : [];
  // const allRows = data ? data.pages.flatMap(d => d.rows) : [];

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
    <AppTableWrapper innerRef={parentRef}>
      <AppTableHeader
        className={cn({
          [styles.noData]: rowVirtualizer.getVirtualItems().length === 0,
        })}
      >
        <AppTableHeaderCell className={cn(styles.label)} alwaysRender>
          {i18n.label}
        </AppTableHeaderCell>
        <AppTableHeaderCell className={cn(styles.commitment)} w320>
          {i18n.commitment}
        </AppTableHeaderCell>
        <AppTableHeaderCell className={cn(styles.valueNum)} w480>
          {i18n.value}
        </AppTableHeaderCell>
        <AppTableHeaderCell className={cn(styles.meta)} w1024>
          {i18n.meta}
        </AppTableHeaderCell>
        <AppTableHeaderCell className={cn(styles.notarized)} w1280>
          {i18n.notarized}
        </AppTableHeaderCell>
        <AppTableHeaderCell className={cn(styles.onChain)} w1280>
          {i18n.on_chain}
        </AppTableHeaderCell>
        <AppTableHeaderCell className={cn(styles.onChain)} flexGrow></AppTableHeaderCell>
      </AppTableHeader>

      {status === "pending" ? (
        <p>Loading...</p>
      ) : status === "error" ? (
        <span>Error: {(error as Error).message}</span>
      ) : (
        <AppTableBody2
          innerRef={parentRef}
          style={{
            height: `500px`,
            width: `100%`,
            overflow: "auto",
          }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map(row => {
              const isLoaderRow = row.index > allRows.length - 1;
              const atst = allRows[row.index];

              if (isLoaderRow) {
                return hasNextPage ? <div key={row.key}>Loading more...</div> : null;
              }

              return (
                <AtstTableRow
                  key={row.key}
                  atst={atst}
                  router={router}
                  setIsNavigating={setIsNavigating}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${row.size}px`,
                    transform: `translateY(${row.start}px)`,
                  }}
                />
              );
            })}
          </div>
        </AppTableBody2>
      )}
    </AppTableWrapper>
  );
};

export default GroupMemberAtstTable;

export interface TwitterAccAtstTableProps {
  nonce: number;
  atst_group_id: string;
}
