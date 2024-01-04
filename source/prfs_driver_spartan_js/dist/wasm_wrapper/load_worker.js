import * as Comlink from "comlink";
export async function initWasm() {
    const worker = new Worker(new URL("./wasm_worker.js", import.meta.url), {
        type: "module",
    });
    const handlers = await Comlink.wrap(worker).handlers;
    if (!handlers) {
        console.log("handlers not found");
        throw new Error("handler not found");
    }
    return handlers;
}
