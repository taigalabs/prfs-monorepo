import React from "react";
import dynamic from "next/dynamic";

const NoSSR = (props: any) => <>{props.children}</>;

export default dynamic(() => Promise.resolve(NoSSR), {
  ssr: false,
});
