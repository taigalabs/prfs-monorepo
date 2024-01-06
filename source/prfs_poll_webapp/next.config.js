const dotenv = require("dotenv");

(() => {
  const envObj = {};
  dotenv.config({ processEnv: envObj });
  console.log("Parsing env variables...");
  console.log(envObj);
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // till we set up proper build pipeline
  transpilePackages: ["@taigalabs/prfs-api-js", "@taigalabs/prfs-react-lib"],

  webpack: (config, { isServer, dev }) => {
    config.resolve.fallback = { fs: false };
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    config.output.webassemblyModuleFilename =
      isServer && !dev ? "../static/wasm/[modulehash].wasm" : "static/wasm/[modulehash].wasm";

    const fileLoaderRule = config.module.rules.find(rule => rule.test?.test?.(".svg"));

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

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
