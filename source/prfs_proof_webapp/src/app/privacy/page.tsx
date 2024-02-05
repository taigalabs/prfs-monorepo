import React, { Suspense } from "react";

import styles from "./page.module.scss";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import DocFooter from "@/components/global_footer/DocFooter";
import DocMasthead from "@/components/doc_masthead/DocMasthead";
import { paths } from "@/paths";
import { getI18N } from "@/i18n/get_i18n";
import PrivacyDoc from "@/components/privacy_doc/PrivacyDoc";

const PrivacyPage = async () => {
  return (
    <DefaultLayout>
      <DefaultBody>
        <Suspense>
          <PrivacyDoc />
        </Suspense>
      </DefaultBody>
      <DefaultFooter>
        <DocFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default PrivacyPage;
