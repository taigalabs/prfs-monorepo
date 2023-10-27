const dotenv = require("dotenv");

(() => {
  const envObj = {};
  dotenv.config({ processEnv: envObj });
  console.log("Parsing env variables...");
  console.log(envObj);
})();

const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});

const nextConfig = (phase, { defaultConfig }) => {
  /** @type {import('next').NextConfig} */
  const cfg = {
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
        },
      );

      // Modify the file loader rule to ignore *.svg, since we have it handled now.
      fileLoaderRule.exclude = /\.svg$/i;

      return config;
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

    eslint: {
      ignoreDuringBuilds: true,
    },
  };

  return cfg;
};

const cfg = withNextra(nextConfig);

// withNextra() removes some properties, thus adding after
cfg.reactStrictMode = true;
cfg.swcMinify = true;
cfg.transpilePackages = [
  "@taigalabs/prfs-sdk-web",
  "@taigalabs/prfs-api-js",
  "@taigalabs/prfs-react-components",
];

module.exports = cfg;
