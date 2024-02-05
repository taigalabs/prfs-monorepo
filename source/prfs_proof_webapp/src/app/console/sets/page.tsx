import React, { Suspense } from "react";
import { redirect } from "next/navigation";

import styles from "./page.module.scss";
import DefaultLayout, { DefaultFooter } from "@/components/layouts/default_layout/DefaultLayout";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import {
  AttestationsDefaultBody,
  AttestationsMain,
  AttestationsMainInner,
} from "@/components/attestations/AttestationComponents";
import Sets from "@/components/sets/Sets";
import SetList from "@/components/set_list/SetList";
import { consolePaths, paths } from "@/paths";
import { envs } from "@/envs";

const SetsPage: React.FC<SetPageProps> = () => {
  return redirect(consolePaths.sets__crypto_holders);
};

export default SetsPage;

interface SetPageProps {}
