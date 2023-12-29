"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simple_git_1 = __importDefault(require("simple-git"));
const paths_1 = __importDefault(require("./paths"));
async function getGitLog() {
    var _a;
    const git = (0, simple_git_1.default)(paths_1.default.workspace);
    const log = await git.log();
    return (_a = log.latest) === null || _a === void 0 ? void 0 : _a.hash;
}
exports.default = getGitLog;
