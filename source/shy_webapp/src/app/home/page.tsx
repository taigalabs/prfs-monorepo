import React from "react";
import { redirect } from "next/navigation";

import { paths } from "@/paths";

const HomePage: React.FC = () => {
  redirect(paths.c__crypto_holders);
};

export default HomePage;
