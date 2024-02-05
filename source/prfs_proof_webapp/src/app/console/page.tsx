import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";

const ConsolePage = () => {
  return (
    <DefaultLayout>
      123
      {/* <DefaultBody noMinWidth> */}
      {/*   <Suspense> */}
      {/*     <HomeMasthead /> */}
      {/*   </Suspense> */}
      {/*   <Suspense> */}
      {/*     <SearchProofTypeForm /> */}
      {/*   </Suspense> */}
      {/* </DefaultBody> */}
      {/* <DefaultFooter> */}
      {/*   <GlobalFooter /> */}
      {/*   <Suspense> */}
      {/*     <TutorialPlaceholder /> */}
      {/*   </Suspense> */}
      {/* </DefaultFooter> */}
    </DefaultLayout>
  );
};

export default ConsolePage;
