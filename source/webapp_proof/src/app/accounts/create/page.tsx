import React, { Suspense } from "react";

import styles from "./page.module.scss";
import IdLayout, { IdBody } from "@/components/layouts/id_layout/IdLayout";
import CreateID from "@/components/create_id/CreateID";

const IdCreatePage = () => {
  return (
    <IdLayout>
      <IdBody>
        <Suspense>
          <CreateID />
        </Suspense>
      </IdBody>
    </IdLayout>
  );
};

export default IdCreatePage;
