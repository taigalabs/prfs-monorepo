import { useEffect, useState } from "react";
import { timeout } from "@taigalabs/prfs-ts-utils";

export function useIsFontReady() {
  const [isFontReady, setIsFontReady] = useState(false);
  useEffect(() => {
    async function fn() {
      const promise = document.fonts.ready;
      timeout(promise, 2500).then(() => {
        // console.log("Roboto", document.fonts.check("1em Roboto"));
        // console.log("Ubuntu", document.fonts.check("1em Ubuntu"));
        setIsFontReady(true);
      });
    }

    fn().then();
  }, [setIsFontReady]);

  return isFontReady;
}
