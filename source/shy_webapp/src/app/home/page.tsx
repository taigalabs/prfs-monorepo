import React from "react";
import { redirect } from "next/navigation";

import { paths } from "@/paths";

const HomePage: React.FC = () => {
  redirect(paths.ch__crypto_holders);
};

export default HomePage;
