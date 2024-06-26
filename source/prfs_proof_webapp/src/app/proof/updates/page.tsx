import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import DocFooter from "@/components/global_footer/DocFooter";
import ProductUpdates from "@/components/product_updates/ProductUpdates";

const UpdatesPage = () => {
  return (
    <DefaultLayout>
      <DefaultBody>
        <Suspense>
          <ProductUpdates />
        </Suspense>
      </DefaultBody>
      <DefaultFooter>
        <DocFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default UpdatesPage;
