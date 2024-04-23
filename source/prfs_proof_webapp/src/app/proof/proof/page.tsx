import React from "react";
import { redirect } from "next/navigation";

import { paths } from "@/paths";

const ProofPage: React.FC = () => {
  redirect(paths.__);
};

export default ProofPage;
