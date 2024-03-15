import React from "react";
import { redirect } from "next/navigation";

import { paths } from "@/paths";

const ConsolePage: React.FC = () => {
  redirect(paths.sets);
};

export default ConsolePage;
