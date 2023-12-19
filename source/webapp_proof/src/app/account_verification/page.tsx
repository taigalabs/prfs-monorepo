import React, { Suspense } from "react";
import { redirect } from "next/navigation";

import { paths } from "@/paths";

const AccountVerificationPage = () => {
  redirect(paths.account_verification__twitter);
};

export default AccountVerificationPage;
