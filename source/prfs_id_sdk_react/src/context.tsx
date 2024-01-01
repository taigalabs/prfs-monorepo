import React from "react";
import {
  createEmbeddedElem,
  CreateEmbeddedElemArgs,
  ListenerRef,
  setupChildMsgHandler,
} from "@taigalabs/prfs-id-sdk-web";

export const PrfsEmbedContext = React.createContext<PrfsEmbedContextType>({ childRef: null });

export const PrfsEmbedProvider: React.FC<PrfsEmbedProviderProps> = ({
  appId,
  children,
  prfsEmbedEndpoint,
}) => {
  // return <i18nContext.Provider value={en}>{children}</i18nContext.Provider>;
  const [childRef, setChildRef] = React.useState<HTMLIFrameElement | null>(null);
  const isInProgressRef = React.useRef(false);
  const prfsEmbedRef = React.useRef<HTMLIFrameElement | null>(null);

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

        // if (!listenerRef.current) {
        //   const listener = await setupChildMsgHandler();
        //   listenerRef.current = listener.current;
        // }

        // Unlock mutex
        isInProgressRef.current = false;
      }
    }
    fn().then();
  }, []);

  // return <>{children}</>;
  return <PrfsEmbedContext.Provider value={{ childRef }}>{children}</PrfsEmbedContext.Provider>;
};

export interface PrfsEmbedProviderProps {
  children: React.ReactNode;
  appId: string;
  prfsEmbedEndpoint: string;
}

export interface PrfsEmbedContextType {
  childRef: HTMLIFrameElement | null;
}
