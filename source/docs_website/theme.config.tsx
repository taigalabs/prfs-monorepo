import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

import Footer from "@/components/footer/Footer";

const config: DocsThemeConfig = {
  darkMode: true,
  logo: <span>Prfs docs</span>,
  project: {
    link: "https://github.com/shuding/nextra-docs-template",
  },
  chat: {
    link: "https://discord.com",
  },
  docsRepositoryBase: "https://github.com/shuding/nextra-docs-template",
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
