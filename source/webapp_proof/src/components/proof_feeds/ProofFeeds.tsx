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

import styles from "./ProofFeeds.module.scss";
import { i18nContext } from "@/contexts/i18n";
import CaptionedImg from "@taigalabs/prfs-react-components/src/captioned_img/CaptionedImg";
import { PublicInputMeta } from "@taigalabs/prfs-entities/bindings/PublicInputMeta";
import dayjs from "dayjs";
import RowItem from "./RowItem";
import { paths } from "@/paths";

const fetchSize = 25;

const ProofFeeds: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
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
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
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
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
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
      <div className={styles.borderBox} />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div
          className={styles.feedContainer}
          onScroll={e => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
          ref={tableContainerRef}
        >
          <div className={styles.topPlaceholder} />
          <div>
            {paddingTop > 0 && (
              <div>
                <div style={{ height: `${paddingTop}px` }} />
              </div>
            )}
            {virtualRows.map(virtualRow => {
              const row = rows[virtualRow.index] as Row<PrfsProofInstanceSyn1>;

              return <RowItem key={row.id} row={row} />;
            })}
            {paddingBottom > 0 && (
              <div>
                <div style={{ height: `${paddingBottom}px` }} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProofFeeds;
