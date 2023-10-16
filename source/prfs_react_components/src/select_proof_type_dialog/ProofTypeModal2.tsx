import React from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { BiLinkExternal } from "@react-icons/all-files/bi/BiLinkExternal";
import { prfsApi2 } from "@taigalabs/prfs-api-js";

import styles from "./ProofTypeModal2.module.scss";
import CaptionedImg from "../captioned_img/CaptionedImg";
import { ProofTypeItem } from "./ProofTypeModal";

// async function fetchServerPage(
//   limit: number,
//   offset: number = 0
// ): Promise<{ rows: string[]; nextOffset: number | undefined }> {
//   console.log("fetch", limit, offset);

//   const rows = new Array(limit).fill(0).map((e, i) => `Async loaded row #${i + offset * limit}`);

//   await new Promise(r => setTimeout(r, 500));

//   return { rows, nextOffset: offset + 1 };
// }

const ProofTypeModal2: React.FC<ProofTypeModal2Props> = ({ handleSelectVal }) => {
  const handleClickExternalLink = React.useCallback((ev: React.MouseEvent, url: string) => {
    ev.stopPropagation();
    window.open(url, "_blank");
  }, []);

  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery(
      ["projects"],
      async ({ pageParam = 0 }) => {
        // fetchServerPage(10, pageParam)
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
    estimateSize: () => 60,
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
              const proofType = allRows[virtualRow.index];
              const url = `${process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/proof_types/${proofType.proof_type_id}`;

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
                    <div
                      className={styles.row}
                      onClick={() =>
                        handleSelectVal({
                          proofTypeId: proofType.proof_type_id,
                          label: proofType.label,
                          imgUrl: proofType.img_url,
                        })
                      }
                    >
                      <div className={styles.imgCol}>
                        <CaptionedImg img_url={proofType.img_url} size={50} />
                      </div>
                      <div className={styles.label}>
                        <p>{proofType.label}</p>
                        <div className={styles.icon}>
                          <div onClick={ev => handleClickExternalLink(ev, url)}>
                            <BiLinkExternal />
                          </div>
                        </div>
                      </div>
                      <p className={styles.proofTypeId}>{proofType.proof_type_id}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div>{isFetching && !isFetchingNextPage ? "Background Updating..." : null}</div>
    </div>
  );
};

export default ProofTypeModal2;

export interface ProofTypeModal2Props {
  handleSelectVal: (item: ProofTypeItem) => void;
}
