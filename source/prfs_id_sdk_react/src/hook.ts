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
    async function fn() {
      if (!childRef.current && isInProgressRef.current === false) {
        // mutex
        isInProgressRef.current = true;

        const el = createEmbeddedElem({
          appId,
          prfsEmbedEndpoint,
        });

        childRef.current = el;
        isInProgressRef.current = false;

        if (!listenerRef.current) {
          const listener = await setupChildMsgHandler();
          // listenerRef.current = listener;
        }
      }
    }
    fn().then();
  }, []);

  return childRef;
}
