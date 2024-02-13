// @ts-ignore
const snarkJs = require("snarkjs");
import throttle from "lodash.throttle";
import { fromRpcSig } from "@ethereumjs/util";
export const snarkJsWitnessGen = async (input, wasmFile) => {
    const witness = {
        type: "mem",
    };
    await snarkJs.wtns.calculate(input, wasmFile, witness);
    return witness;
};
export async function fetchAsset(assetName, url, eventListener) {
    const response = await fetch(url);
    if (!response?.body) {
        throw new Error("Response does not contain body");
    }
    const contentLen = response.headers.get("Content-Length");
    const totalLen = typeof contentLen === "string" && parseInt(contentLen);
    if (!totalLen) {
        throw new Error(`Content length is not parsable, assetName: ${assetName}`);
    }
    const emitProgress = throttle((val) => {
        eventListener(val);
    }, 400, { leading: true, trailing: true });
    const reader = response.body.getReader();
    const chunks = [];
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
export const fromSig = (sig) => {
    const { r: _r, s: _s, v } = fromRpcSig(sig);
    const r = BigInt("0x" + _r.toString("hex"));
    const s = BigInt("0x" + _s.toString("hex"));
    return { r, s, v };
};
