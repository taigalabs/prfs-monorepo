"use client";

import React from "react";

import styles from "./ProductUpdates.module.scss";
import UpdatesMD from "@/components/update_contents/23h2.mdx";
import { Markdown } from "@/components/markdown/Markdown";
import DocMasthead from "../doc_masthead/DocMasthead";
import { paths } from "@/paths";
import { i18nContext } from "@/i18n/context";
import { MastheadPlaceholder } from "@/components/masthead/Masthead";
import DocumentView from "@/components/document_view/DocumentView";

const ProductUpdates = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <>
      <DocMasthead title={i18n.updates} titleHref={paths.updates} />
      <MastheadPlaceholder />
      <DocumentView>
        <Markdown>
          <UpdatesMD />
        </Markdown>
      </DocumentView>
    </>
  );
};

export default ProductUpdates;
