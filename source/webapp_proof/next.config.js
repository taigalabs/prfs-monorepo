const dotenv = require("dotenv");
const withMDX = require("@next/mdx")();

(() => {
  const envObj = {};
  dotenv.config({ processEnv: envObj });
  console.log("Parsing env variables...");
  console.log(envObj);
})();

module.exports = (phase, { defaultConfig }) => {
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    pageExtensions: ["js", "jsx", "mdx", "md", "ts", "tsx"],
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
        }
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
      logging: {
        level: "verbose",
      },
    },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "**.amazonaws.com",
          port: "",
          pathname: "/**",
        },
      ],
    },
  };

  return withMDX(nextConfig);
};
