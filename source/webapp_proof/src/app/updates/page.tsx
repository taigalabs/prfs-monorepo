import React from "react";

import styles from "./page.module.scss";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import UpdatesMD from "@/components/update_contents/23h2.mdx";
import UpdatesMasthead from "./UpdatesMasthead";
import DocFooter from "@/components/global_footer/DocFooter";
import { Markdown } from "@/components/markdown/Markdown";

const UpdatesPage = () => {
  return (
    <DefaultLayout>
      <UpdatesMasthead />
      <DefaultBody>
        <div className={styles.bodyContainer}>
          <Markdown>
            <UpdatesMD />
          </Markdown>
        </div>
      </DefaultBody>
      <DefaultFooter>
        <DocFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default UpdatesPage;
