"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const webpack_1 = __importDefault(require("webpack"));
const dayjs_1 = __importDefault(require("dayjs"));
const dev_config_1 = __importDefault(require("../webpack/dev.config"));
const app_1 = require("./app");
const paths_1 = __importDefault(require("./paths"));
const git_1 = __importDefault(require("./git"));
(async () => {
    const destPath = `${paths_1.default.dist}/index.html`;
    console.log("Copying file, src: %s, dst: %s", paths_1.default.indexHtml, destPath);
    if (!fs_1.default.existsSync(paths_1.default.dist)) {
        fs_1.default.mkdirSync(paths_1.default.dist);
    }
    fs_1.default.copyFileSync(paths_1.default.indexHtml, destPath);
    console.log("webpack dev config: %j", dev_config_1.default);
    const compiler = (0, webpack_1.default)(dev_config_1.default);
    console.log("Start webpack compilation, watching");
    compiler.watch({}, (err, stats) => {
        if (err) {
            console.error(err);
        }
        if (stats) {
            console.log("\nWebpack compilation");
            console.log(stats.toJson("minimal").assetsByChunkName);
        }
    });
    const commit_hash = await (0, git_1.default)();
    const now = (0, dayjs_1.default)().toJSON();
    (0, app_1.createApp)({ commit_hash, launch_time: now });
})();
