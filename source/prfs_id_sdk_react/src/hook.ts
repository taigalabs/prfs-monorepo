import React from "react";
import {
  createEmbeddedElem,
  CreateEmbeddedElemArgs,
  ListenerRef,
  setupChildMsgHandler,
} from "@taigalabs/prfs-id-sdk-web";
import { PrfsEmbedContext } from "./context";

const listenerRef: ListenerRef = {
  current: null,
};

export enum PopupStatus {
  Closed,
  Open,
}

export function usePopup() {
  const [isOpen, setIsOpen] = React.useState(false);
  const closeTimerRef = React.useRef<NodeJS.Timer | null>(null);

  function openPopup(endpoint: string, callback: (...args: any) => Promise<any>) {
    // Open the window
    setIsOpen(true);
    const popup = window.open(endpoint, "_blank", "toolbar=0,location=0,menubar=0");
    if (!popup) {
      console.error("Failed to open window");
      setIsOpen(false);
      return;
    }

    if (!closeTimerRef.current) {
      const timer = setInterval(() => {
        if (popup.closed) {
          setIsOpen(false);
          clearInterval(timer);
        }
      }, 4000);
      closeTimerRef.current = timer;
    }

    callback().then(() => {
      popup.close();
      setIsOpen(false);
    });
  }

  return { isOpen, openPopup };
}

export function usePrfsEmbed() {
  return React.useContext(PrfsEmbedContext);
}

export function usePrfsEmbed2({ appId, prfsEmbedEndpoint }: CreateEmbeddedElemArgs) {
  const isInProgressRef = React.useRef(false);
  const prfsEmbedRef = React.useRef<HTMLIFrameElement | null>(null);
  const [_, rerender] = React.useReducer(x => x + 1, 0);

  React.useEffect(() => {
    async function fn() {
      if (!prfsEmbedRef.current && isInProgressRef.current === false) {
        // Lock mutex
        isInProgressRef.current = true;

        const el = createEmbeddedElem({
          appId,
          prfsEmbedEndpoint,
        });
        prfsEmbedRef.current = el;

        if (!listenerRef.current) {
          const listener = await setupChildMsgHandler();
          listenerRef.current = listener.current;
          rerender();
        }

        // Unlock mutex
        isInProgressRef.current = false;
      }
    }
    fn().then();
  }, []);

  // console.log(appId, listenerRef.current, prfsEmbedRef.current);

  return {
    prfsEmbedRef,
    isReady: !!listenerRef.current && !!prfsEmbedRef.current,
  };
}
