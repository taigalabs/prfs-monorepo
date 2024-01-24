import React from "react";
import cn from "classnames";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { atstApi } from "@taigalabs/prfs-api-js";
import { i18nContext } from "@/i18n/context";
import { PrfsCryptoSizeAtst } from "@taigalabs/prfs-entities/bindings/PrfsCryptoSizeAtst";
import { BiLinkExternal } from "@react-icons/all-files/bi/BiLinkExternal";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { abbrevAddr } from "@taigalabs/prfs-web3-js";

import styles from "./CryptoSizeAtstTable.module.scss";
import { paths } from "@/paths";
import {
  AttestationTableBody,
  AttestationTableHeader,
  AttestationTableHeaderCell,
  AttestationTableRow,
  AttestationTableBodyInner,
  AttestationTableCell,
  AttestationTableNoRecord,
} from "@/components/attestations_table/AttestationsTable";

const AtstRow: React.FC<AtstRowProps> = ({ atst, style, router }) => {
  const i18n = React.useContext(i18nContext);
  const walletAddr = React.useMemo(() => {
    return abbrevAddr(atst.wallet_addr);
  }, [atst.wallet_addr]);
  const cm = React.useMemo(() => {
    return `${atst.cm.substring(0, 12)}...`;
  }, [atst.cm]);
  const handleClick = React.useCallback(() => {
    router.push(`${paths.attestations__crypto_size}/${atst.atst_id}`);
  }, [atst.atst_id, router]);
  const cryptoAssets = React.useMemo(() => {
    if (typeof atst.crypto_assets === "object") {
      return `${JSON.stringify(atst.crypto_assets).substring(0, 20)}...`;
    } else {
      return "";
    }
  }, [atst.cm]);
  const handleClickCryptoAssets = React.useCallback(
    (ev: React.MouseEvent) => {
      ev.stopPropagation();
      window.open(`https://etherscan.io/address/${atst.wallet_addr.toLowerCase()}`, "_blank");
    },
    [atst.wallet_addr],
  );

  return (
    <AttestationTableRow style={style} handleClick={handleClick}>
      <AttestationTableCell className={cn(styles.walletAddr, styles.cell)}>
        <span>{walletAddr}</span>
      </AttestationTableCell>
      <AttestationTableCell className={cn(styles.commitment, styles.w1024)}>
        {cm}
      </AttestationTableCell>
      <AttestationTableCell className={cn(styles.totalValue, styles.w1024)}>
        {Number(atst.total_value_usd)}
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

const TwitterAccAtstTable: React.FC<TwitterAccAtstTableProps> = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["get_crypto_size_atsts"],
      queryFn: async ({ pageParam }) => {
        return atstApi("get_crypto_size_atsts", { offset: pageParam as number });
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
  atst: PrfsCryptoSizeAtst;
  style: React.CSSProperties;
  router: AppRouterInstance;
}
