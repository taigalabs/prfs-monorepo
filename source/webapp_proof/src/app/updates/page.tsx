import React from "react";

import styles from "./page.module.scss";
import DefaultLayout, { DefaultBody, DefaultFooter } from "@/layouts/default_layout/DefaultLayout";
import HomeFooter from "@/components/home_footer/HomeFooter";
import UpdatesMD from "@/updates/23h2.mdx";
import DocMasthead from "@/components/masthead/DocMasthead";

const UpdatesPage = () => {
  return (
    <DefaultLayout>
      <DocMasthead />
      <DefaultBody>
        <div>
          <UpdatesMD />
        </div>
      </DefaultBody>
      <DefaultFooter>
        <HomeFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default UpdatesPage;
