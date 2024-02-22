import React from "react";
import cn from "classnames";
import { useInfiniteQuery } from "@taigalabs/prfs-react-lib/react_query";
import { useVirtualizer } from "@taigalabs/prfs-react-lib/react_virtual";
import { prfsApi2, prfsApi3 } from "@taigalabs/prfs-api-js";
import { i18nContext } from "@/i18n/context";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { BiLinkExternal } from "@react-icons/all-files/bi/BiLinkExternal";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import styles from "./ProofTypeTable.module.scss";
import { paths } from "@/paths";
import {
  AttestationTableBody,
  AttestationTableHeader,
  AttestationTableHeaderCell,
  AttestationTableRow,
  AttestationTableBodyInner,
  AttestationTableCell,
} from "@/components/attestations_table/AttestationsTable";

const Row: React.FC<RowProps> = ({ row, style, router }) => {
  const i18n = React.useContext(i18nContext);
  const label = React.useMemo(() => {
    return `${row.label.substring(0, 26)}...`;
  }, [row.label]);
  const desc = React.useMemo(() => {
    return `${row.label.substring(0, 18)}...`;
  }, [row.desc]);
  const circuitId = React.useMemo(() => {
    return `${row.label.substring(0, 12)}...`;
  }, [row.circuit_id]);
  // const handleClick = React.useCallback(() => {
  //   router.push(`${paths.attestations__twitter}/${atst.acc_atst_id}`);
  // }, [atst.acc_atst_id, router]);

  return (
    <AttestationTableRow style={style}>
      <AttestationTableCell className={cn(styles.label)}>
        <span>{label}</span>
      </AttestationTableCell>
      <AttestationTableCell className={cn(styles.desc, styles.w1024)}>{desc}</AttestationTableCell>
      <AttestationTableCell className={cn(styles.circuitId, styles.w1024)}>
        {circuitId}
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

const ProofTypeTable: React.FC<ProofTypeTableProps> = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["get_prfs_proof_types"],
      queryFn: async ({ pageParam }) => {
        // return prfsApi2("get_prfs_proof_types", { offset: pageParam as number });
        return prfsApi3({ type: "get_prfs_proof_types", offset: pageParam as number });
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
            <AttestationTableHeaderCell className={cn(styles.label)}>
              {i18n.label}
            </AttestationTableHeaderCell>
            <AttestationTableHeaderCell className={cn(styles.desc, styles.w1024)}>
              {i18n.description}
            </AttestationTableHeaderCell>
            <AttestationTableHeaderCell className={cn(styles.circuitId, styles.w1320)}>
              {i18n.circuit_id}
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

export default ProofTypeTable;

export interface ProofTypeTableProps {}

export interface RowProps {
  row: PrfsProofType;
  style: React.CSSProperties;
  router: AppRouterInstance;
}
