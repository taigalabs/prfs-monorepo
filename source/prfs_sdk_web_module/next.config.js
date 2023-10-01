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

  experimental: {
    logging: {
      level: 'verbose',
      fullUrl: true,
    }
  },

  // till we set up proper build pipeline
  transpilePackages: ["@taigalabs/prfs-api-js", "@taigalabs/prfs-react-components"],

  webpack: (config, { isServer, dev }) => {
    config.resolve.fallback = { fs: false };
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    config.output.webassemblyModuleFilename =
      isServer && !dev ? "../static/wasm/[modulehash].wasm" : "static/wasm/[modulehash].wasm";

    return config;
  },

  async headers() {
    return [
      // {
      //   // Routes this applies to
      //   source: "/api/(.*)",
      //   // Headers
      //   headers: [
      //     // Allow for specific domains to have access or * for all
      //     {
      //       key: "Access-Control-Allow-Origin",
      //       value: "*",
      //       // DOES NOT WORK
      //       // value: process.env.ALLOWED_ORIGIN,
      //     },
      //     // Allows for specific methods accepted
      //     {
      //       key: "Access-Control-Allow-Methods",
      //       value: "GET, POST, PUT, DELETE, OPTIONS",
      //     },
      //     // Allows for specific headers accepted (These are a few standard ones)
      //     {
      //       key: "Access-Control-Allow-Headers",
      //       value: "Content-Type, Authorization",
      //     },
      //   ],
      // },
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
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
        ],
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
