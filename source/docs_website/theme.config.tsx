import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

import Footer from "@/components/footer/Footer";
import ImageLogo from "@/components/image_logo/ImageLogo";
import Navigation from "@/components/navigation/Navigation";
import NavbarExtraContent from "@/components/navbar_extra_content/NavbarExtraContent";

const config: DocsThemeConfig = {
  darkMode: true,
  docsRepositoryBase: "https://github.com/taigalabs/prfs-monorepo/source/docs_website",
  footer: {
    component: Footer,
  },
  nextThemes: {
    defaultTheme: "light",
  },
  feedback: {
    useLink: () => {
      return "https://github.com/taigalabs/prfs-monorepo/discussions/categories/q-a";
    },
  },
  logo: () => {
    return <ImageLogo width={60} />;
  },
  navbar: {
    component: Navigation,
    extraContent: NavbarExtraContent,
  },
  logoLink: false,
  primaryHue: 48,
  primarySaturation: 10,
};

export default config;
