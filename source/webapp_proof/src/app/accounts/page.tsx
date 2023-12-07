import React, { Suspense } from "react";

import styles from "./page.module.scss";
import IdLayout, { IdBody } from "@/components/layouts/id_layout/IdLayout";
import SignIn from "@/components/sign_in/SignIn";
import { paths } from "@/paths";
import { redirect } from "next/navigation";

const AccountsPage = () => {
  redirect(paths.accounts__signin);
};

export default AccountsPage;
