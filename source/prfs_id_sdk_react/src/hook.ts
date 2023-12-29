import React from "react";
import {
  createEmbeddedElem,
  CreateEmbeddedElemArgs,
  setupChildMsgHandler,
} from "@taigalabs/prfs-id-sdk-web";

export function usePrfsEmbed({ appId, prfsEmbedEndpoint }: CreateEmbeddedElemArgs) {
  const isInProgressRef = React.useRef(false);
  const childRef = React.useRef<HTMLIFrameElement | null>(null);
  const listenerRef = React.useRef<Function | null>(null);

  React.useEffect(() => {
    if (!childRef.current && isInProgressRef.current === false) {
      // mutex
      isInProgressRef.current = true;

      const el = createEmbeddedElem({
        appId,
        prfsEmbedEndpoint,
      });

      if (!listenerRef.current) {
        const listener = setupChildMsgHandler();
        listenerRef.current = listener;
      }

      childRef.current = el;
      isInProgressRef.current = false;
    }
  }, []);

  return childRef;
}
