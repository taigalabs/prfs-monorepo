import throttle from "lodash.throttle";
import { DriverEvent, DriverEventListener } from "@taigalabs/prfs-driver-interface";

export async function fetchAsset(
  assetName: string,
  url: string,
  eventListener: DriverEventListener,
  assetLen: number,
): Promise<Uint8Array> {
  const response = await fetch(url);

  if (!response?.body) {
    throw new Error("Response does not contain body");
  }

  response.headers.forEach(v => console.log(v, assetName));

  const contentLen = response.headers.get("content-length");
  const totalLen = (typeof contentLen === "string" && parseInt(contentLen)) || assetLen;

  if (!totalLen) {
    console.warn(
      `Content-length header missing, len: ${totalLen}, assetName: ${assetName}, url: ${url}`,
    );
  }

  const emitProgress = throttle(
    (val: DriverEvent) => {
      eventListener(val);
    },
    400,
    { leading: true, trailing: true },
  );

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];

  let receivedLen = 0;
  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }
    chunks.push(value);
    receivedLen += value.length;

    if (typeof totalLen === "number") {
      const step = parseFloat((receivedLen / totalLen).toFixed(2)) * 100;

      emitProgress({
        type: "LOAD_DRIVER_EVENT",
        payload: {
          asset_label: assetName,
          progress: step,
        },
      });
    }
  }

  if (!response.ok) {
    throw new Error(`Fetch asset failed, url: ${url}`);
  }

  const arr = new Uint8Array(totalLen);

  let offset = 0;
  for (const chunk of chunks) {
    arr.set(chunk, offset);
    offset += chunk.length;
  }

  return arr;
}
