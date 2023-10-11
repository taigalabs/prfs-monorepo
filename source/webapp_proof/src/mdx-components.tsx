import type { MDXComponents } from "mdx/types";

import { H1, Ul, Li } from "./components/markdown/Markdown";

// import Image from "next/image";

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => <H1>{children}</H1>,
    ul: ({ children }) => <Ul>{children}</Ul>,
    li: ({ children }) => <Li>{children}</Li>,
    // img: props => <Image sizes="100vw" style={{ width: "100%", height: "auto" }} {...props} />,
    ...components,
  };
}
