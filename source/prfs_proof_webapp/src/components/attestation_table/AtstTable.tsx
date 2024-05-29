import React from "react";
import cn from "classnames";
import { useInfiniteQuery, useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { useVirtualizer } from "@taigalabs/prfs-react-lib/react_virtual";
import { atstApi, prfsApi3 } from "@taigalabs/prfs-api-js";
import { useRouter } from "next/navigation";
import { GetPrfsAttestationsByAtstGroupIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsAttestationsByAtstGroupIdRequest";
import { PrfsAtstGroupId } from "@taigalabs/prfs-entities/bindings/PrfsAtstGroupId";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";

import styles from "./AtstTable.module.scss";
import {
  AppTableWrapper,
  AppTableLoading,
  AppTableBody,
} from "@/components/app_table_components/AppTableComponents";
import AtstTableRow, { AtstHeaderRow } from "./AtstTableRow";
import { useAppTableBodyHeight } from "@/components/app_table_components/useAppTable";

function usePrfsAtstGroup(atst_group_id: string) {
  return useQuery({
    queryKey: ["get_prfs_atst_group_by_group_id", atst_group_id],
    queryFn: async () => {
      return atstApi({ type: "get_prfs_atst_group_by_group_id", atst_group_id });
    },
  });
}

const GroupMemberAtstTable: React.FC<TwitterAccAtstTableProps> = ({ nonce, atst_group_id }) => {
  const bodyRef = React.useRef<HTMLDivElement | null>(null);
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { data: prfsAtstGroupData, isPending: prfsAtstGroupDataIsPending } =
    usePrfsAtstGroup(atst_group_id);
  const atstGroup = prfsAtstGroupData?.payload?.atst_group;
  const { bodyHeight } = useAppTableBodyHeight(bodyRef);

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
    <AppTableWrapper>
      <AtstHeaderRow atstGroup={atstGroup} />
      {status === "pending" ? (
        <AppTableLoading>
          <Spinner />
        </AppTableLoading>
      ) : status === "error" ? (
        <span>Error: {(error as Error).message}</span>
      ) : (
        <AppTableBody innerRef={bodyRef}>
          <div
            ref={parentRef}
            className="List"
            style={{
              height: bodyHeight,
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
                  return hasNextPage ? (
                    <div key={row.key}>
                      <AppTableLoading>
                        <Spinner />
                      </AppTableLoading>
                    </div>
                  ) : null;
                }

                return (
                  atstGroup && (
                    <AtstTableRow
                      key={row.key}
                      atstGroup={atstGroup}
                      atst={atst}
                      router={router}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${row.size}px`,
                        transform: `translateY(${row.start}px)`,
                      }}
                    />
                  )
                );
              })}
            </div>
          </div>
        </AppTableBody>
      )}
      {/* <div>{isFetching && !isFetchingNextPage ? "Background Updating..." : null}</div> */}
    </AppTableWrapper>
  );
};

export default GroupMemberAtstTable;

export interface TwitterAccAtstTableProps {
  nonce: number;
  atst_group_id: string;
}
