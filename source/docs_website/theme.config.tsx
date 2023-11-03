import React from "react";
import { useRouter } from "next/router";
import { useConfig, useTheme, type DocsThemeConfig } from "nextra-theme-docs";
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";

import Footer from "@/components/footer/Footer";
import Navigation from "@/components/navigation/Navigation";
import NavbarExtraContent from "@/components/navbar_extra_content/NavbarExtraContent";

const config: DocsThemeConfig = {
  darkMode: true,
  docsRepositoryBase: "https://github.com/taigalabs/prfs-monorepo/source/docs_website",
  useNextSeoProps: function SEO() {
    const { frontMatter } = useConfig();

    const section = "Prfs";
    const defaultTitle = frontMatter.overrideTitle || section;

    return {
      description: frontMatter.description,
      defaultTitle,
      titleTemplate: `%s – ${section}`,
    };
  },
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
