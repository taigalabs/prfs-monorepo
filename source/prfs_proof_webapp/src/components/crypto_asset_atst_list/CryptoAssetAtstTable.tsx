import React from "react";
import cn from "classnames";
import { useInfiniteQuery } from "@taigalabs/prfs-react-lib/react_query";
import { useVirtualizer } from "@taigalabs/prfs-react-lib/react_virtual";
import { atstApi } from "@taigalabs/prfs-api-js";
import { PrfsAttestation } from "@taigalabs/prfs-entities/bindings/PrfsAttestation";
import { BiLinkExternal } from "@react-icons/all-files/bi/BiLinkExternal";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { abbrevAddr } from "@taigalabs/prfs-crypto-js";
import { GetPrfsAttestationsRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsAttestationsRequest";

import styles from "./CryptoAssetAtstTable.module.scss";
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
} from "@/components/attestations_table/AttestationsTable";
import { useI18N } from "@/i18n/use_i18n";

const AtstRow: React.FC<AtstRowProps> = ({ atst, style, router, setIsNavigating }) => {
  const i18n = useI18N();

  const walletAddr = React.useMemo(() => {
    return abbrevAddr(atst.label);
  }, [atst.label]);

  const cm = React.useMemo(() => {
    return `${atst.cm.substring(0, 12)}...`;
  }, [atst.cm]);

  const handleClickRow = React.useCallback(() => {
    setIsNavigating(true);
    router.push(`${paths.attestations__crypto_asset}/${atst.atst_id}`);
  }, [atst.atst_id, router, setIsNavigating]);

  const cryptoAssets = React.useMemo(() => {
    if (typeof atst.meta === "object") {
      return JSON.stringify(atst.meta);
    } else {
      return "";
    }
  }, [atst.cm]);

  const handleClickCryptoAssets = React.useCallback(
    (ev: React.MouseEvent) => {
      ev.stopPropagation();
      window.open(`https://etherscan.io/address/${atst.label.toLowerCase()}`, "_blank");
    },
    [atst.label],
  );

  return (
    <AttestationTableRow style={style} handleClick={handleClickRow}>
      <AttestationTableCell className={cn(styles.walletAddr, styles.cell)}>
        <span>{walletAddr}</span>
      </AttestationTableCell>
      <AttestationTableCell className={cn(styles.commitment, styles.w1024)}>
        {cm}
      </AttestationTableCell>
      <AttestationTableCell className={cn(styles.totalValue, styles.w1024)}>
        {Number(atst.value)}
      </AttestationTableCell>
      <AttestationTableCell className={cn(styles.cryptoAssets, styles.w480, styles.cell)}>
        <a target="_blank" onClick={handleClickCryptoAssets}>
          <span>{cryptoAssets}</span>
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

const CryptoAssetAtstTable: React.FC<TwitterAccAtstTableProps> = ({ nonce }) => {
  const i18n = useI18N();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = React.useState(false);

  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["get_prfs_attestations", nonce],
      queryFn: async ({ pageParam }) => {
        const req: GetPrfsAttestationsRequest = {
          atst_type_id: "crypto_1",
          offset: pageParam as number,
        };
        return atstApi({
          type: "get_prfs_attestations",
          ...req,
        });
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
      {isNavigating ? (
        <AttestationLoading>{i18n.navigating}...</AttestationLoading>
      ) : status === "pending" ? (
        <AttestationLoading>{i18n.loading}...</AttestationLoading>
      ) : status === "error" ? (
        <AttestationLoading>Error: {(error as Error).message}</AttestationLoading>
      ) : (
        <>
          <AttestationTableHeader
            className={cn({
              [styles.noData]: rowVirtualizer.getVirtualItems().length === 0,
            })}
          >
            <AttestationTableHeaderCell className={cn(styles.walletAddr)}>
              {i18n.wallet_address}
            </AttestationTableHeaderCell>
            <AttestationTableHeaderCell className={cn(styles.commitment, styles.w1024)}>
              {i18n.commitment}
            </AttestationTableHeaderCell>
            <AttestationTableHeaderCell className={cn(styles.totalValue, styles.w1024)}>
              {i18n.total_value_usd}
            </AttestationTableHeaderCell>
            <AttestationTableHeaderCell className={cn(styles.cryptoAssets, styles.w1320)}>
              {i18n.crypto_assets}
            </AttestationTableHeaderCell>
            <AttestationTableHeaderCell className={cn(styles.notarized, styles.w1320)}>
              {i18n.notarized}
            </AttestationTableHeaderCell>
            <AttestationTableHeaderCell className={cn(styles.onChain, styles.w1320)}>
              {i18n.on_chain}
            </AttestationTableHeaderCell>
          </AttestationTableHeader>
          <AttestationTableBody innerRef={parentRef}>
            {rowVirtualizer.getVirtualItems().length === 0 && (
              <AttestationTableNoRecord>{i18n.no_record_to_present}</AttestationTableNoRecord>
            )}
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
                    setIsNavigating={setIsNavigating}
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

export default CryptoAssetAtstTable;

export interface TwitterAccAtstTableProps {
  nonce: number;
}

export interface AtstRowProps {
  atst: PrfsAttestation;
  style: React.CSSProperties;
  router: AppRouterInstance;
  setIsNavigating: React.Dispatch<React.SetStateAction<boolean>>;
}