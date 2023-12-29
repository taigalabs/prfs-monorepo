"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_config_1 = __importDefault(require("./webpack.config"));
const devConfig = Object.assign(Object.assign({}, webpack_config_1.default), { mode: "development" });
exports.default = devConfig;
