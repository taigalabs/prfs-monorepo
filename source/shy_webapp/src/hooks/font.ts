import { useState } from "react";

export function useIsFontReady() {
  const [isFontReady, setIsFontReady] = useState();
  // const isFontReady = document.fonts.ready;

  return isFontReady;

  // then(() => {
  //   console.log(123);
  // });
}
