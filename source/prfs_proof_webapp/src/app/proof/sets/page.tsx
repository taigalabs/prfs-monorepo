import React from "react";
import { redirect } from "next/navigation";

import styles from "./page.module.scss";
import { consolePaths, paths } from "@/paths";

const SetsPage: React.FC<SetPageProps> = () => {
  return redirect(paths.sets__crypto_holders);
};

export default SetsPage;

interface SetPageProps {}
