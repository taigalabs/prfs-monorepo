import React from "react";
import {
  createEmbeddedElem,
  CreateEmbeddedElemArgs,
  ListenerRef,
  setupChildMsgHandler,
} from "@taigalabs/prfs-id-sdk-web";

export function usePrfsEmbed({ appId, prfsEmbedEndpoint }: CreateEmbeddedElemArgs) {
  const isInProgressRef = React.useRef(false);
  const childRef = React.useRef<HTMLIFrameElement | null>(null);
  const listenerRef = React.useRef<ListenerRef | null>(null);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    async function fn() {
      if (!childRef.current && isInProgressRef.current === false) {
        // Lock mutex
        isInProgressRef.current = true;

        const el = createEmbeddedElem({
          appId,
          prfsEmbedEndpoint,
        });

        childRef.current = el;

        if (!listenerRef.current) {
          const listener = await setupChildMsgHandler();
          listenerRef.current = listener;
          setIsReady(true);
        }
        // Unlock mutex
        isInProgressRef.current = false;
      }
    }
    fn().then();
  }, []);

  return {
    childRef,
    isReady,
  };
}
