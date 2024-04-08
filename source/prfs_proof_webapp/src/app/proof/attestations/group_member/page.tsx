import React from "react";
import { redirect } from "next/navigation";

import styles from "./page.module.scss";
import { paths } from "@/paths";
import { NONCE_ATST_GROUP_ID } from "@/atst_group_id";

const CryptoSizePage = () => {
  redirect(`${paths.attestations__group_member}/${NONCE_ATST_GROUP_ID}`);
};

export default CryptoSizePage;
