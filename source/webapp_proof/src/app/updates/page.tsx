import React from "react";

import styles from "./page.module.scss";
import DefaultLayout, { DefaultBody, DefaultFooter } from "@/layouts/default_layout/DefaultLayout";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import UpdatesMD from "@/updates/23h2.mdx";
import UpdatesMasthead from "./UpdatesMasthead";

const UpdatesPage = () => {
  return (
    <DefaultLayout>
      <UpdatesMasthead />
      <DefaultBody>
        <div className={styles.content}>
          <UpdatesMD />
        </div>
      </DefaultBody>
      <DefaultFooter>
        <GlobalFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default UpdatesPage;
