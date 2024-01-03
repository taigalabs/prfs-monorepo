export declare type WasmTypes = typeof import("./build");
export declare const wasmSingleton: WasmSingleton;
export declare function initWasm(): Promise<typeof import("./build")>;
interface WasmSingleton {
    wasm: typeof import("./build") | null;
}
export {};
