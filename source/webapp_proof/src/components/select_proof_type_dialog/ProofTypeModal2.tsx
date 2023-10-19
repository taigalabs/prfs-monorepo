import React from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { BiLinkExternal } from "@react-icons/all-files/bi/BiLinkExternal";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import CaptionedImg from "@taigalabs/prfs-react-components/src/captioned_img/CaptionedImg";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";

import styles from "./ProofTypeModal2.module.scss";
import TutorialStepper from "../tutorial/TutorialStepper";

const Row: React.FC<RowProps> = ({ proofType, handleSelectVal }) => {
  const url = `${process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/proof_types/${proofType.proof_type_id}`;

  const handleClickExternalLink = React.useCallback(
    (ev: React.MouseEvent) => {
      ev.stopPropagation();
      window.open(url, "_blank");
    },
    [url]
  );

  const extendedHandleSelectVal = React.useCallback(() => {
    handleSelectVal(proofType);
  }, [handleSelectVal, proofType]);

  return (
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
  );
};

const ProofTypeModal2: React.FC<ProofTypeModal2Props> = ({ handleSelectVal }) => {
  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery(
      ["projects"],
      async ({ pageParam = 0 }) => {
        const { payload } = await prfsApi2("get_prfs_proof_types", {
          page_idx: pageParam,
          page_size: 5,
        });
        return payload;
      },
      {
        getNextPageParam: lastPage => lastPage.next_idx,
      }
    );

  const allRows = data ? data.pages.flatMap(d => d.prfs_proof_types) : [];
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
      {status === "loading" ? (
        <p>Loading...</p>
      ) : status === "error" ? (
        <span>Error: {(error as Error).message}</span>
      ) : (
        <TutorialStepper stages={[2]}>
          <div
            ref={parentRef}
            style={{
              height: "300px",
              overflow: "auto",
            }}
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: "relative",
              }}
            >
              {items.map(virtualRow => {
                const isLoaderRow = virtualRow.index > allRows.length - 1;

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
                    {isLoaderRow ? (
                      hasNextPage ? (
                        "Loading more..."
                      ) : (
                        "Nothing more to load"
                      )
                    ) : (
                      <Row
                        proofType={allRows[virtualRow.index]}
                        handleSelectVal={handleSelectVal}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </TutorialStepper>
      )}
    </div>
  );
};

export default ProofTypeModal2;

export interface ProofTypeModal2Props {
  handleSelectVal: (item: PrfsProofType) => void;
}

export interface RowProps {
  proofType: PrfsProofType;
  handleSelectVal: (item: PrfsProofType) => void;
}
