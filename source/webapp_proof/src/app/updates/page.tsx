import React from "react";

import styles from "./page.module.scss";
import DefaultLayout, { DefaultBody, DefaultFooter } from "@/layouts/default_layout/DefaultLayout";
import HomeFooter from "@/components/home_footer/HomeFooter";
import UpdatesMD from "@/updates/23h2.mdx";
import UpdatesMasthead from "./UpdatesMasthead";

const UpdatesPage = () => {
  return (
    <DefaultLayout>
      <UpdatesMasthead />
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
