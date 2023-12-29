"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const paths_1 = __importDefault(require("./paths"));
const PORT = process.env.PORT || 3012;
async function createApp(args) {
    console.log("Create express app, args: %o", args);
    const { commit_hash, launch_time } = args;
    const app = (0, express_1.default)();
    app.use((req, _, next) => {
        console.log(req.method, decodeURI(req.url));
        next();
    });
    app.use((0, cors_1.default)());
    app.use((_, res, next) => {
        res.set("Cross-Origin-Embedder-Policy", "require-corp");
        res.set("Cross-Origin-Opener-Policy", "same-origin");
        res.set("Cross-Origin-Resource-Policy", "cross-origin");
        next();
    });
    app.use("/", express_1.default.static(paths_1.default.dist));
    app.get("/status", (_, res) => {
        res.send({
            status: "Ok",
            commit_hash,
            launch_time,
        });
    });
    app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
    return app;
}
exports.createApp = createApp;
