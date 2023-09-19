import React from "react";
import { useRouter } from "next/navigation";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import {
  Cell,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtual } from "react-virtual";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import { GetPrfsProofInstancesResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsProofInstancesResponse";
import CaptionedImg from "@taigalabs/prfs-react-components/src/captioned_img/CaptionedImg";
import { PublicInputMeta } from "@taigalabs/prfs-entities/bindings/PublicInputMeta";
import dayjs from "dayjs";

import styles from "./TimelineFeeds.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import FeedItem from "./FeedItem";
import RightBar from "@/components/right_bar/RightBar";
import TimelineHeader from "./TimelineHeader";
import {
  ContentMainCenter,
  ContentMainInfiniteScroll,
} from "@/components/content_area/ContentArea";

const fetchSize = 15;

const TimelineFeeds: React.FC<TimelineFeedsProps> = ({ channelId }) => {
  const i18n = React.useContext(i18nContext);
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const rightBarContainerRef = React.useRef<HTMLDivElement>(null);
  const rref = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  const columns = React.useMemo<ColumnDef<PrfsProofInstanceSyn1>[]>(
    () => [
      {
        accessorFn: row => row.img_url,
        header: "Img url",
        cell: info => {
          const img_url = info.getValue() as string;

          return (
            <div className={styles.imgCol}>
              <CaptionedImg img_url={img_url} size={50} />
            </div>
          );
        },
      },
      {
        accessorFn: row => row.proof_label,
        header: "Label",
      },
      {
        accessorFn: row => row.created_at,
        header: "Created At",
        cell: info => {
          const val = info.getValue() as string;
          const day = dayjs(val);
          return day.format("YYYY-MM-DD");
        },
      },
      {
        accessorFn: row => row,
        header: "Prioritized inputs",
        cell: info => {
          const row = info.getValue() as PrfsProofInstanceSyn1;

          const { public_inputs } = row;

          let values = [];
          for (const meta of row.public_inputs_meta as PublicInputMeta[]) {
            if (meta.show_priority === 0) {
              const { name } = meta;
              if (public_inputs[name]) {
                values.push(public_inputs[name]);
              }
            }
          }

          return values;
        },
      },
      {
        accessorFn: row => row.proof_instance_id,
        header: "Proof instance id",
      },
    ],
    []
  );

  const { data, fetchNextPage, isFetching, isLoading } =
    useInfiniteQuery<GetPrfsProofInstancesResponse>(
      ["get_prfs_proof_instances"],
      async ({ pageParam = 0 }) => {
        const start = pageParam * fetchSize;

        const { payload } = await prfsApi2("get_prfs_proof_instances", {
          page_idx: start,
          page_size: fetchSize,
        });
        return payload;
      },
      {
        getNextPageParam: (_lastGroup, groups) => groups.length,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
      }
    );

  // we must flatten the array of arrays from the useInfiniteQuery hook
  const flatData = React.useMemo(
    () => data?.pages?.flatMap(page => page.prfs_proof_instances_syn1) ?? [],
    [data]
  );
  const totalDBRowCount = data?.pages?.[0]?.table_row_count ?? 0;
  const totalFetched = flatData.length;

  // called on scroll and possibly on mount to fetch more data
  // as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      // console.log(55, containerRefElement, rightBarContainerRef);
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;

        const { scrollHeight: sh, scrollTop: st, clientHeight: ch } = rightBarContainerRef.current!;
        console.log(clientHeight, scrollTop, sh, st, ch);

        if (ch < clientHeight) {
          rightBarContainerRef.current!.style.marginTop = `0px`;
        } else {
          const delta = clientHeight + scrollTop - ch;
          if (delta >= 0) {
            // console.log(11, delta);
            // rightBarContainerRef.current.style.marginTop = `${delta}px`;
            rref.current!.style.marginTop = `${delta}px`;
          } else {
            rightBarContainerRef.current!.style.marginTop = "0px";
          }
        }

        // once the user has scrolled within 300px of the bottom of the table,
        // fetch more data if there is any
        if (
          scrollHeight - scrollTop - clientHeight < 300 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount, rightBarContainerRef, rref]
  );

  // a check on mount and after a fetch to see if the table is already
  // scrolled to the bottom and immediately needs to fetch more data
  React.useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const table = useReactTable({
    data: flatData,
    columns,
    state: {},
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 10,
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;
  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0;

  return (
    <div className={styles.wrapper}>
      <ContentMainInfiniteScroll
        // className={styles.feedContainer}
        onScroll={e => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
        dRef={tableContainerRef}
      >
        <ContentMainCenter>
          {/* <div className={styles.headerContainer}> */}
          {/*   <TimelineHeader channelId={channelId} /> */}
          {/* </div> */}
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div>
              {paddingTop > 0 && (
                <div>
                  <div style={{ height: `${paddingTop}px` }} />
                </div>
              )}
              {virtualRows.map((virtualRow, idx) => {
                const row = rows[virtualRow.index] as Row<PrfsProofInstanceSyn1>;
                console.log(idx);

                return <FeedItem key={row.id} row={row} no={idx} />;
              })}
              {paddingBottom > 0 && (
                <div>
                  <div style={{ height: `${paddingBottom}px` }} />
                </div>
              )}
            </div>
          )}
        </ContentMainCenter>
        <div ref={rightBarContainerRef}>
          <div ref={rref}></div>
          <div className={styles.rightBarContainer}>
            <RightBar />
            <div className={styles.t}>3</div>
          </div>
        </div>
      </ContentMainInfiniteScroll>
    </div>
  );
};

export default TimelineFeeds;

export interface TimelineFeedsProps {
  channelId: string;
}
