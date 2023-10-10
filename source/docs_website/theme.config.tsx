import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

import Footer from "@/components/footer/Footer";
import ImageLogo from "@/components/image_logo/ImageLogo";
import Navigation from "@/components/navigation/Navigation";

const config: DocsThemeConfig = {
  darkMode: true,
  docsRepositoryBase: "https://github.com/taigalabs/prfs-monorepo/source/docs_website",
  footer: {
    component: Footer,
  },
  nextThemes: {
    defaultTheme: "light",
  },
  logo: () => {
    return <ImageLogo width={60} />;
  },
  navbar: {
    component: Navigation,
  },
  logoLink: false,
};

export default config;
