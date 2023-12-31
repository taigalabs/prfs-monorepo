import React from "react";
import {
  createEmbeddedElem,
  CreateEmbeddedElemArgs,
  ListenerRef,
  setupChildMsgHandler,
} from "@taigalabs/prfs-id-sdk-web";

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

export function usePrfsEmbed({ appId, prfsEmbedEndpoint }: CreateEmbeddedElemArgs) {
  const isInProgressRef = React.useRef(false);
  const prfsEmbedRef = React.useRef<HTMLIFrameElement | null>(null);
  const [isReady, setIsReady] = React.useState(false);

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
        }
        setIsReady(true);

        // Unlock mutex
        isInProgressRef.current = false;
      }
    }
    fn().then();
  }, []);

  return {
    prfsEmbedRef,
    isReady,
  };
}
