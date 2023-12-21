import React from "react";
import { redirect } from "next/navigation";

import { paths } from "@/paths";

const IdPage = () => {
  redirect(paths.id__signin);
};

export default IdPage;
