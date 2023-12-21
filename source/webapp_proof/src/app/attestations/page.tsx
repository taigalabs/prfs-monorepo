import { redirect } from "next/navigation";

import { paths } from "@/paths";

const AttestationsPage = () => {
  redirect(paths.attestations__twitter);
};

export default AttestationsPage;
