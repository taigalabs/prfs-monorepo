import React from "react";
import { redirect } from "next/navigation";

import { consolePaths, paths } from "@/paths";
import { urls } from "@/urls";

const ConsolePage: React.FC = () => {
  redirect(consolePaths.sets);
};

export default ConsolePage;
