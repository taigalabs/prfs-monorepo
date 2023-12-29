import React from "react";
import { createEmbeddedElem, CreateEmbeddedElemArgs } from "@taigalabs/prfs-id-sdk-web";

export function usePrfsEmbed({ appId, prfsEmbedEndpoint }: CreateEmbeddedElemArgs) {
  const elRef = React.useRef<HTMLIFrameElement | null>(null);

  if (!elRef.current) {
    const el = createEmbeddedElem({
      appId,
      prfsEmbedEndpoint,
    });

    elRef.current = el;
  }

  return elRef;
}
