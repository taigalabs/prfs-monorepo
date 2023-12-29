"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const path_1 = __importDefault(require("path"));
const webpack_1 = __importDefault(require("webpack"));
const node_polyfill_webpack_plugin_1 = __importDefault(require("node-polyfill-webpack-plugin"));
const isProd = process.env.NODE_ENV === "production";
const str = JSON.stringify;
const entryPath = path_1.default.resolve(__dirname, "../src/index.ts");
const distPath = path_1.default.resolve(__dirname, "../dist/");
console.log("webpack entryPath: %s, distPath: %s", entryPath, distPath);
const config = {
    mode: "development",
    entry: entryPath,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    target: "web",
    externals: [],
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        fallback: {
            fs: require.resolve("browserify-fs"),
            crypto: require.resolve("crypto-browserify"),
        },
    },
    plugins: [
        new node_polyfill_webpack_plugin_1.default(),
        new webpack_1.default.DefinePlugin({
            "process.env.NEXT_PUBLIC_PRFS_SDK_VERSION": str(process.env.NEXT_PUBLIC_PRFS_SDK_VERSION),
            "process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT": str(process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT),
            "process.env.NEXT_PUBLIC_PRFS_ASSET_ACCESS_ENDPOINT": str(process.env.NEXT_PUBLIC_PRFS_ASSET_ACCESS_ENDPOINT),
        }),
    ],
    experiments: { asyncWebAssembly: true },
    output: {
        path: distPath,
        filename: "index.js",
        // not used
        webassemblyModuleFilename: isProd
            ? "../static/wasm/[modulehash].wasm"
            : "static/wasm/[modulehash].wasm",
    },
};
exports.default = config;
