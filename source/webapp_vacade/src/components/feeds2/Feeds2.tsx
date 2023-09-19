import React from "react";
import Link from "next/link";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "react-query/devtools";
//
import styles from "./Feeds2.module.scss";

const queryClient = new QueryClient();

export default function Feeds2() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

function Example() {
  const { ref, inView } = useInView();

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery(
    ["projects"],
    async ({ pageParam = 0 }) => {
      const res = await axios.post("/api/projects?cursor=" + pageParam);
      return res.data;
    },
    {
      getPreviousPageParam: firstPage => firstPage.previousId ?? undefined,
      getNextPageParam: lastPage => lastPage.nextId ?? undefined,
    }
  );

  console.log(11, data);

  React.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className={styles.wrapper}>
      <h1>Infinite Loading</h1>
      {status === "loading" ? (
        <p>Loading...</p>
      ) : status === "error" ? (
        <span>Error: </span>
      ) : (
        <>
          <div>
            <button
              onClick={() => fetchPreviousPage()}
              disabled={!hasPreviousPage || isFetchingPreviousPage}
            >
              {isFetchingPreviousPage
                ? "Loading more..."
                : hasPreviousPage
                ? "Load Older"
                : "Nothing more to load"}
            </button>
          </div>
          {data.pages.map(page => (
            <React.Fragment key={page.nextId}>
              {page.data.map((project: any) => (
                <p
                  style={{
                    border: "1px solid gray",
                    borderRadius: "5px",
                    padding: "10rem 1rem",
                    background: `hsla(${project.id * 30}, 60%, 80%, 1)`,
                  }}
                  key={project.id}
                >
                  {project.name}
                </p>
              ))}
            </React.Fragment>
          ))}
          <div>
            <button
              ref={ref}
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                ? "Load Newer"
                : "Nothing more to load"}
            </button>
          </div>
          <div>{isFetching && !isFetchingNextPage ? "Background Updating..." : null}</div>
        </>
      )}
      <hr />
      {/* <ReactQueryDevtools initialIsOpen /> */}
    </div>
  );
}
