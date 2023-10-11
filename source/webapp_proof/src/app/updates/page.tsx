import React from "react";
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";

import styles from "./page.module.scss";
import DefaultLayout, { DefaultBody, DefaultFooter } from "@/layouts/default_layout/DefaultLayout";
import Masthead from "@/components/masthead/Masthead";
import HomeFooter from "@/components/home_footer/HomeFooter";
import UpdatesMD from "@/updates/23h2.mdx";

const UpdatesPage = () => {
  return (
    <DefaultLayout>
      <Masthead variant="mini" />
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
