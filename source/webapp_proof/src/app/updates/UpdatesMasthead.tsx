import React from "react";

import styles from "./page.module.scss";
import DocMasthead from "@/components/masthead/DocMasthead";
import { paths } from "@/paths";
import { getI18N } from "@/i18n/get_i18n";

const UpdatesMasthead = async () => {
  const i18n = await getI18N();

  return <DocMasthead title={i18n.updates} titleHref={paths.updates} />;
};

export default UpdatesMasthead;
