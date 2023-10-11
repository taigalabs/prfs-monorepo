// @ts-nocheck

import { parseArgs } from "node:util";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import { Envs } from "./src/envs";
//
// const { parseArgs } = require("node:util");
// const fs = require("fs");
// const path = require("path");
// const chalk = require("chalk");

// const remarkParse = require("remark-parse");

// const { unified } = import("unified");
// const { Envs } = require("./src/envs");

const __dirname = path.resolve();
const DOT_ENV_PATH = path.resolve(".env");
const UPDATES_PATH = path.resolve(__dirname, "./src/updates");

async function run() {
  console.log("%s createEnvs.ts prfs web launch", chalk.green("Launching"));

  const mds = await processMds();

  console.log(1, mds);

  createEnvs({
    mds,
  });
}

async function processMds() {
  const fd = fs.readdirSync(UPDATES_PATH);

  const { unified } = await import("unified");
  console.log(11, fd, unified);

  const file = await unified()
    .use(remarkParse) // Convert into markdown AST
    .use(remarkRehype) // Transform to HTML AST
    .use(rehypeSanitize) // Sanitize HTML input
    .use(rehypeStringify) // Convert AST into serialized HTML
    .process("Hello, Next.js!");

  return 3;
  // return String(file);
}

function createEnvs({ mds }) {
  const { values } = parseArgs({
    options: {
      production: {
        type: "boolean",
      },
      teaser: {
        type: "boolean",
      },
    },
  });

  console.log("cli args: %j", values);

  const { production, teaser } = values;

  /** @type {import('src/env').Envs} */
  const env_dev = {
    NEXT_PUBLIC_IS_TEASER: teaser ? "yes" : "no",
    NEXT_PUBLIC_UPDATE_TIMESTAMP: "",
    NEXT_PUBLIC_CODE_REPOSITORY_URL: "https://github.com/taigalabs/prfs-monorepo",
    NEXT_PUBLIC_TAIGALABS_ENDPOINT: "http://localhost:3060",
    NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT: "http://localhost:3020",
    NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT: "http://localhost:3000",
    NEXT_PUBLIC_WEBAPP_POLL_ENDPOINT: "http://localhost:3021",
    NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT: "http://localhost:4000",
    NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT: "http://localhost:4010",
    NEXT_PUBLIC_PRFS_SDK_WEB_ENDPOINT: "http://localhost:3010",
    NEXT_PUBLIC_ZAUTH_VERSION: "0.1.0",
    NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT: "http://localhost:3061",
  };

  /** @type {import('src/env').Envs} */
  const env_prod = {
    NEXT_PUBLIC_IS_TEASER: teaser ? "yes" : "no",
    NEXT_PUBLIC_UPDATE_TIMESTAMP: "",
    NEXT_PUBLIC_CODE_REPOSITORY_URL: "https://github.com/taigalabs/prfs-monorepo",
    NEXT_PUBLIC_TAIGALABS_ENDPOINT: "https://www.taigalabs.xyz",
    NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT: "https://console.prfs.xyz",
    NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT: "https://www.prfs.xyz",
    NEXT_PUBLIC_WEBAPP_POLL_ENDPOINT: "https://poll.prfs.xyz",
    NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT: "https://api.prfs.xyz",
    NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT: "https://asset.prfs.xyz",
    NEXT_PUBLIC_PRFS_SDK_WEB_ENDPOINT: "https://sdk.prfs.xyz",
    NEXT_PUBLIC_ZAUTH_VERSION: "0.1.0",
    NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT: "http://docs.prfs.xyz",
  };

  const envs = production ? env_prod : env_dev;
  console.log("Writing envs to %s, envs: %o", DOT_ENV_PATH, envs);

  writeEnvsToDotEnv(envs);
}

function writeEnvsToDotEnv(envs) {
  let ws = fs.createWriteStream(DOT_ENV_PATH);

  for (const [key, val] of Object.entries(envs)) {
    ws.write(`${key}=${val}\n`);
  }

  ws.close();
}

run().then();

// interface CreateEnvsArgs {
//   mds: any;
// }
