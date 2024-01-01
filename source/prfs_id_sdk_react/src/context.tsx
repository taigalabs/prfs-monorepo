import React from "react";
import { createEmbeddedElem, ListenerRef, setupChildMsgHandler } from "@taigalabs/prfs-id-sdk-web";

export const PrfsEmbedContext = React.createContext<PrfsEmbedContextType>({
  appId: null,
  prfsEmbed: null,
  isReady: false,
});

export const PrfsEmbedProvider: React.FC<PrfsEmbedProviderProps> = ({
  appId,
  prfsEmbedEndpoint,
  children,
}) => {
  const isInProgressRef = React.useRef(false);
  const [prfsEmbed, setPrfsEmbed] = React.useState<HTMLIFrameElement | null>(null);
  const [listener, setListener] = React.useState<ListenerRef | null>(null);

  React.useEffect(() => {
    async function fn() {
      if (!prfsEmbed && isInProgressRef.current === false) {
        // Lock mutex
        isInProgressRef.current = true;

        const el = createEmbeddedElem({
          appId,
          prfsEmbedEndpoint,
        });
        setPrfsEmbed(el);

        if (!listener) {
          const listener = await setupChildMsgHandler();
          setListener(listener);
          console.log("Attached prfs embed listener, appId: %s", appId);
        }

        // Unlock mutex
        isInProgressRef.current = false;
      }
    }
    fn().then();
  }, [setPrfsEmbed, setListener]);

  // return <>{children}</>;
  return (
    <PrfsEmbedContext.Provider value={{ prfsEmbed, isReady: !!listener, appId }}>
      {children}
    </PrfsEmbedContext.Provider>
  );
};

export interface PrfsEmbedProviderProps {
  children: React.ReactNode;
  appId: string;
  prfsEmbedEndpoint: string;
}

export interface PrfsEmbedContextType {
  prfsEmbed: HTMLIFrameElement | null;
  isReady: boolean;
  appId: string | null;
}
