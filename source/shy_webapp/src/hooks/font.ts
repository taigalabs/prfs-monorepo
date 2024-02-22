import { useEffect, useState } from "react";

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

function timeout(prom: Promise<any>, time: number) {
  return Promise.race([prom, new Promise((_r, rej) => setTimeout(rej, time))]);
}
