import React from "react";
import cn from "classnames";

import styles from "./InfiniteScrollComponents.module.scss";

export const InfiniteScrollWrapper: React.FC<TimelineFeedsWrapperProps> = ({
  children,
  innerRef,
  className,
  handleScroll,
}) => {
  return (
    <div className={cn(styles.wrapper, className)} ref={innerRef} onScroll={handleScroll}>
      {children}
    </div>
  );
};

export const InfiniteScrollInner: React.FC<TimelineFeedsMainProps> = ({ children, className }) => {
  return <div className={cn(styles.inner, className)}>{children}</div>;
};

export const InfiniteScrollMain: React.FC<TimelineFeedsMainProps> = ({ children, className }) => {
  return <div className={cn(styles.main, className)}>{children}</div>;
};

export const InfiniteScrollLeft: React.FC<TimelineFeedsMainProps> = ({ children, className }) => {
  return <div className={cn(styles.left, className)}>{children}</div>;
};

export const InfiniteScrollRight: React.FC<TimelineFeedsMainProps> = ({ children, className }) => {
  return <div className={cn(styles.right, className)}>{children}</div>;
};

export const InfiniteScrollRowContainer: React.FC<TimelineFeedsMainProps> = ({
  children,
  className,
  style,
}) => {
  return (
    <div className={cn(styles.rowContainer, className)} style={style}>
      {children}
    </div>
  );
};

// export const InfiniteScrollPlaceholder: React.FC<InfiniteScrollPlaceholderProps> = ({
//   className,
// }) => {
//   return <div className={cn(styles.placeholder, className)} />;
// };

// const TimelineFeeds: React.FC<TimelineFeedsProps> = () => {
//   const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
//     useInfiniteQuery({
//       queryKey: ["get_shy_posts"],
//       queryFn: async ({ pageParam = 0 }) => {
//         return await shyApi("get_shy_posts", {
//           offset: pageParam,
//         });
//       },
//       initialPageParam: 0,
//       getNextPageParam: lastPage => {
//         if (lastPage.payload) {
//           return lastPage.payload.next_offset;
//         } else {
//           return null;
//         }
//       },
//     });

//   const allRows = data
//     ? data.pages.flatMap(d => {
//         if (d.payload) {
//           return d.payload.shy_posts;
//         } else {
//           [];
//         }
//       })
//     : [];
//   const parentRef = React.useRef<HTMLDivElement | null>(null);
//   const rightBarContainerRef = React.useRef<HTMLDivElement | null>(null);

//   const rowVirtualizer = useVirtualizer({
//     count: hasNextPage ? allRows.length + 1 : allRows.length,
//     getScrollElement: () => parentRef.current,
//     estimateSize: () => 100,
//     overscan: 5,
//   });

//   React.useEffect(() => {
//     const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

//     if (!lastItem) {
//       return;
//     }

//     if (lastItem.index >= allRows.length - 1 && hasNextPage && !isFetchingNextPage) {
//       fetchNextPage();
//     }
//   }, [
//     hasNextPage,
//     fetchNextPage,
//     allRows.length,
//     isFetchingNextPage,
//     rowVirtualizer.getVirtualItems(),
//   ]);

//   const handleScroll = React.useCallback(() => {
//     // console.log(55, containerRefElement, rightBarContainerRef.current);
//     if (parentRef.current && rightBarContainerRef.current) {
//       const { scrollHeight, scrollTop, clientHeight } = parentRef.current;
//       const { scrollHeight: sh, scrollTop: st, clientHeight: ch } = rightBarContainerRef.current!;

//       if (ch < clientHeight) {
//         rightBarContainerRef.current!.style.top = `0px`;
//       } else {
//         const delta = clientHeight + scrollTop - ch;
//         if (delta >= 0) {
//           rightBarContainerRef.current.style.transform = `translateY(${delta}px)`;
//         } else {
//           rightBarContainerRef.current!.style.transform = "translateY(0px)";
//         }
//       }
//     }
//   }, [isFetching, parentRef.current, rightBarContainerRef.current]);

//   if (status === "error") {
//     return <span>Error: {(error as Error).message}</span>;
//   }

//   return (
//     <div className={styles.wrapper} ref={parentRef} onScroll={handleScroll}>
//       <div className={styles.main}>
//         {status === "pending" ? (
//           <div className={styles.loading}>
//             <Spinner />
//           </div>
//         ) : (
//           <>
//             <div className={styles.placeholder} />
//             <div>{isFetching && !isFetchingNextPage ? "Background Updating..." : null}</div>
//             <div
//               className={styles.infiniteScroll}
//               style={{
//                 height: `${rowVirtualizer.getTotalSize()}px`,
//                 position: "relative",
//               }}
//             >
//               {rowVirtualizer.getVirtualItems().map(virtualRow => {
//                 const isLoaderRow = virtualRow.index > allRows.length - 1;
//                 const post = allRows[virtualRow.index];

//                 return (
//                   <div
//                     style={{
//                       position: "absolute",
//                       top: 0,
//                       left: 0,
//                       width: "100%",
//                       height: `${virtualRow.size}px`,
//                       transform: `translateY(${virtualRow.start}px)`,
//                     }}
//                     className={styles.row}
//                     key={virtualRow.index}
//                     data-index={virtualRow.index}
//                     ref={rowVirtualizer.measureElement}
//                   >
//                     {isLoaderRow
//                       ? hasNextPage
//                         ? "Loading more..."
//                         : "Nothing more to load"
//                       : post && <Row post={post} />}
//                   </div>
//                 );
//               })}
//             </div>
//           </>
//         )}
//       </div>
//       <div className={styles.side}>
//         <RightBar />
//       </div>
//       {/* </div> */}
//     </div>
//   );
// };

export interface TimelineFeedsWrapperProps {
  children: React.ReactNode;
  className?: string;
  innerRef: React.MutableRefObject<HTMLDivElement | null>;
  handleScroll?: () => void;
}

export interface TimelineFeedsMainProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface InfiniteScrollPlaceholderProps {
  className?: string;
}

export interface TimelineFeedsProps {
  // infQueryResult: UseInfiniteQueryResult<InfiniteData<any>>;
}
