import React from "react";

import { paths } from "@/paths";
import { redirect } from "next/navigation";

const AccountsPage = () => {
  redirect(paths.accounts__signin);
};

export default AccountsPage;
