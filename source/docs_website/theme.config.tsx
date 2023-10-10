import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

import Footer from "@/components/footer/Footer";

const config: DocsThemeConfig = {
  darkMode: true,
  logo: <span>Prfs docs</span>,
  chat: {
    link: "https://discord.com",
  },
  docsRepositoryBase: "https://github.com/taigalabs/prfs-monorepo/source/docs_website",
  footer: {
    component: Footer,
  },
  nextThemes: {
    defaultTheme: "light",
  },
  head: () => {
    return <></>;
  },
};

export default config;
