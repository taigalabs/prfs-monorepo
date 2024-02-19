import React from "react";
import cn from "classnames";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { BiLinkExternal } from "@react-icons/all-files/bi/BiLinkExternal";
import { prfsApi2, prfsApi3 } from "@taigalabs/prfs-api-js";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";

import styles from "./ProofTypeModal.module.scss";
import CaptionedImg from "../captioned_img/CaptionedImg";

const Row: React.FC<RowProps> = ({ proofType, handleSelectVal, webappConsoleEndpoint }) => {
  const url = `${webappConsoleEndpoint}/proof_types/${proofType.proof_type_id}`;

  const handleClickExternalLink = React.useCallback(
    (ev: React.MouseEvent) => {
      ev.stopPropagation();
      window.open(url, "_blank");
    },
    [url],
  );

  const extendedHandleSelectVal = React.useCallback(() => {
    handleSelectVal(proofType);
  }, [handleSelectVal, proofType]);

  return (
    proofType && (
      <div className={styles.row} onClick={extendedHandleSelectVal}>
        <div className={styles.left}>
          <CaptionedImg img_url={proofType.img_url} size={32} />
        </div>
        <div className={styles.right}>
          <div className={styles.labelRow}>
            <span>{proofType.label}</span>
            <div className={styles.icon} onClick={handleClickExternalLink}>
              <BiLinkExternal />{" "}
            </div>
          </div>
          <p className={styles.proofTypeId}>{proofType.proof_type_id}</p>
        </div>
      </div>
    )
  );
};

const ProofTypeModal2: React.FC<ProofTypeModal2Props> = ({
  handleSelectVal,
  webappConsoleEndpoint,
}) => {
  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["get_prfs_proof_types"],
      queryFn: async ({ pageParam = 0 }) => {
        // return await prfsApi2("get_prfs_proof_types", {
        //   offset: pageParam as number,
        // });
        return await prfsApi3({
          type: "get_prfs_proof_types",
          offset: pageParam as number,
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

  const allRows = data ? data.pages.flatMap(d => d.payload && d.payload.rows) : [];
  const parentRef = React.useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 44,
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

  const items = rowVirtualizer.getVirtualItems();

  return (
    <div className={styles.wrapper}>
      {status === "pending" ? (
        <p className={cn(styles.row, styles.loading)}>Loading...</p>
      ) : status === "error" ? (
        <span>Error: {(error as Error).message}</span>
      ) : (
        <div ref={parentRef} className={styles.inner}>
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            {items.map(virtualRow => {
              const isLoaderRow = virtualRow.index > allRows.length - 1;
              const proofType = allRows[virtualRow.index];

              return (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  key={virtualRow.index}
                  data-index={virtualRow.index}
                  ref={rowVirtualizer.measureElement}
                >
                  {isLoaderRow
                    ? hasNextPage
                      ? "Loading more..."
                      : "Nothing more to load"
                    : proofType && (
                        <Row
                          proofType={proofType}
                          handleSelectVal={handleSelectVal}
                          webappConsoleEndpoint={webappConsoleEndpoint}
                        />
                      )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProofTypeModal2;

export interface ProofTypeModal2Props {
  handleSelectVal: (item: PrfsProofType) => void;
  webappConsoleEndpoint: string;
}

export interface RowProps {
  proofType: PrfsProofType;
  webappConsoleEndpoint: string;
  handleSelectVal: (item: PrfsProofType) => void;
}
