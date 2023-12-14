import React from "react";

import { paths } from "@/paths";
import { redirect } from "next/navigation";

const IdPage = () => {
  redirect(paths.id__signin);
};

export default IdPage;
