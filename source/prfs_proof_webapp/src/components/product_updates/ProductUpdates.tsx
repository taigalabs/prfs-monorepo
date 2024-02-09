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
import { envs } from "@/envs";

const ProductUpdates = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <>
      <DocMasthead title={i18n.updates} titleHref={paths.updates} />
      <MastheadPlaceholder />
      <DocumentView>
        <div className={styles.versionMeta}>
          <div className={styles.row}>
            <p>{i18n.build_time}</p>
            <p>{envs.NEXT_PUBLIC_LAUNCH_TIMESTAMP}</p>
          </div>
          <div className={styles.row}>
            <p>{i18n.commit_hash}</p>
            <p>{envs.NEXT_PUBLIC_GIT_COMMIT_HASH}</p>
          </div>
        </div>
        <Markdown>
          <UpdatesMD />
        </Markdown>
      </DocumentView>
    </>
  );
};

export default ProductUpdates;
