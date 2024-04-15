import React from "react";
import cn from "classnames";
import { useInfiniteQuery } from "@taigalabs/prfs-react-lib/react_query";
import { useVirtualizer } from "@taigalabs/prfs-react-lib/react_virtual";
import { atstApi } from "@taigalabs/prfs-api-js";
import { PrfsAttestation } from "@taigalabs/prfs-entities/bindings/PrfsAttestation";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";
import { GetPrfsAttestationsByAtstGroupIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsAttestationsByAtstGroupIdRequest";
import Link from "next/link";
import { PrfsAtstGroupId } from "@taigalabs/prfs-entities/bindings/PrfsAtstGroupId";
import { ReactQueryDevtools } from "@taigalabs/prfs-react-lib/react_query_devtools";
import { useWindowVirtualizer } from "@taigalabs/prfs-react-lib/react_virtual";

import styles from "./AttestationTable.module.scss";
import { paths } from "@/paths";
import {
  AttestationTableBody,
  AttestationTableHeader,
  AttestationTableHeaderCell,
  AttestationTableRow,
  AttestationTableBodyInner,
  AttestationTableCell,
  AttestationTableNoRecord,
  AttestationLoading,
  AttestationTableBody2,
} from "@/components/atst_table_components/AtstTableComponents";
import { useI18N } from "@/i18n/use_i18n";
import AtstRow from "./AtstRow";

// async function fetchServerPage(
//   limit: number,
//   offset: number = 0,
// ): Promise<{ rows: string[]; nextOffset: number }> {
//   const rows = new Array(limit).fill(0).map((e, i) => `Async loaded row #${i + offset * limit}`);

//   await new Promise(r => setTimeout(r, 500));

//   return { rows, nextOffset: offset + 1 };
// }

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
    <div className={styles.wrapper} ref={parentRef}>
      <AttestationTableHeader
        className={cn({
          [styles.noData]: rowVirtualizer.getVirtualItems().length === 0,
        })}
      >
        <AttestationTableHeaderCell className={cn(styles.label, styles.w1024)}>
          {i18n.label}
        </AttestationTableHeaderCell>
        <AttestationTableHeaderCell className={cn(styles.commitment, styles.w1024)}>
          {i18n.commitment}
        </AttestationTableHeaderCell>
        <AttestationTableHeaderCell className={cn(styles.valueNum, styles.w1024)}>
          {i18n.value}
        </AttestationTableHeaderCell>
        <AttestationTableHeaderCell className={cn(styles.meta, styles.w1320)}>
          {i18n.meta}
        </AttestationTableHeaderCell>
        <AttestationTableHeaderCell className={cn(styles.notarized, styles.w1320)}>
          {i18n.notarized}
        </AttestationTableHeaderCell>
        <AttestationTableHeaderCell className={cn(styles.onChain, styles.w1320)}>
          {i18n.on_chain}
        </AttestationTableHeaderCell>
      </AttestationTableHeader>

      {status === "pending" ? (
        <p>Loading...</p>
      ) : status === "error" ? (
        <span>Error: {(error as Error).message}</span>
      ) : (
        <AttestationTableBody2
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
                <AtstRow
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
        </AttestationTableBody2>
      )}
    </div>
  );

  // return (
  //   <div className={styles.wrapper}>
  //     {isNavigating ? (
  //       <AttestationLoading>{i18n.navigating}...</AttestationLoading>
  //     ) : status === "pending" ? (
  //       <AttestationLoading>{i18n.loading}...</AttestationLoading>
  //     ) : status === "error" ? (
  //       <AttestationLoading>Error: {(error as Error).message}</AttestationLoading>
  //     ) : (
  //       <>
  //         <AttestationTableHeader
  //           className={cn({
  //             [styles.noData]: rowVirtualizer.getVirtualItems().length === 0,
  //           })}
  //         >
  //           <AttestationTableHeaderCell className={cn(styles.label, styles.w1024)}>
  //             {i18n.label}
  //           </AttestationTableHeaderCell>
  //           <AttestationTableHeaderCell className={cn(styles.commitment, styles.w1024)}>
  //             {i18n.commitment}
  //           </AttestationTableHeaderCell>
  //           <AttestationTableHeaderCell className={cn(styles.valueNum, styles.w1024)}>
  //             {i18n.value}
  //           </AttestationTableHeaderCell>
  //           <AttestationTableHeaderCell className={cn(styles.meta, styles.w1320)}>
  //             {i18n.meta}
  //           </AttestationTableHeaderCell>
  //           <AttestationTableHeaderCell className={cn(styles.notarized, styles.w1320)}>
  //             {i18n.notarized}
  //           </AttestationTableHeaderCell>
  //           <AttestationTableHeaderCell className={cn(styles.onChain, styles.w1320)}>
  //             {i18n.on_chain}
  //           </AttestationTableHeaderCell>
  //         </AttestationTableHeader>
  //         <AttestationTableBody innerRef={parentRef}>
  //           {rowVirtualizer.getVirtualItems().length === 0 && (
  //             <AttestationTableNoRecord>{i18n.no_record_to_present}</AttestationTableNoRecord>
  //           )}
  //           <AttestationTableBodyInner
  //             style={{
  //               height: `${rowVirtualizer.getTotalSize()}px`,
  //             }}
  //           >
  //             {rowVirtualizer.getVirtualItems().map(virtualRow => {
  //               const isLoaderRow = virtualRow.index > allRows.length - 1;
  //               const row = allRows[virtualRow.index];

  //               if (isLoaderRow) {
  //                 return hasNextPage ? <div>Loading more...</div> : null;
  //               }

  //               console.log("row", virtualRow.index, row);

  //               // return (
  //               //   <AtstRow
  //               //     key={virtualRow.index}
  //               //     atst={row}
  //               //     router={router}
  //               //     setIsNavigating={setIsNavigating}
  //               //     style={{
  //               //       position: "absolute",
  //               //       top: 0,
  //               //       left: 0,
  //               //       width: "100%",
  //               //       height: `${virtualRow.size}px`,
  //               //       transform: `translateY(${virtualRow.start}px)`,
  //               //     }}
  //               //   />
  //               // );
  //               return <div key={virtualRow.index}>{row.toString()}</div>;
  //             })}
  //           </AttestationTableBodyInner>
  //         </AttestationTableBody>
  //         <ReactQueryDevtools initialIsOpen />
  //       </>
  //     )}
  //   </div>
  // );
};

export default GroupMemberAtstTable;

export interface TwitterAccAtstTableProps {
  nonce: number;
  atst_group_id: string;
}
