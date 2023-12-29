"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const paths = (() => {
    const dist = path_1.default.resolve(__dirname, "../dist");
    const workspace = path_1.default.resolve(__dirname, "../../../");
    const indexHtml = path_1.default.resolve(__dirname, "../index.html");
    const p = {
        workspace,
        dist,
        indexHtml,
    };
    console.log("%s paths, %o", chalk_1.default.green("Initialized"), p);
    return p;
})();
exports.default = paths;
