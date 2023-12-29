"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const app_1 = require("./app");
const git_1 = __importDefault(require("./git"));
(async () => {
    const commit_hash = await (0, git_1.default)();
    const now = (0, dayjs_1.default)().toJSON();
    (0, app_1.createApp)({
        commit_hash,
        launch_time: now,
    });
})();
