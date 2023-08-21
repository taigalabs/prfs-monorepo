const dotenv = require("dotenv");

(() => {
  const envObj = {};
  dotenv.config({ processEnv: envObj });
  console.log("Parsing prfs_web env variables...");
  console.log(envObj);
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // till we set up proper build pipeline
  transpilePackages: [
    "@taigalabs/prfs-sdk-web",
    "@taigalabs/prfs-api-js",
    "@taigalabs/prfs-react-components",
  ],

  webpack: (config, { isServer, dev }) => {
    config.resolve.fallback = { fs: false };
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    config.output.webassemblyModuleFilename =
      isServer && !dev ? "../static/wasm/[modulehash].wasm" : "static/wasm/[modulehash].wasm";

    return config;
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    logging: "verbose",
  },
};

module.exports = nextConfig;
