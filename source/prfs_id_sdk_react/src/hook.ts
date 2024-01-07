import React from "react";
import { PrfsEmbedContext } from "./context";

export function usePopup() {
  function openPopup(endpoint: string, callback: (popup: Window) => Promise<any>) {
    // Open the window
    const popup = window.open(endpoint, "_blank", "toolbar=0,location=0,menubar=0");
    if (!popup) {
      console.error("Failed to open window");
      return;
    }

    callback(popup).then(() => {
      // popup.close();
    });
  }

  return { openPopup };
}

export function usePrfsEmbed() {
  return React.useContext(PrfsEmbedContext);
}
