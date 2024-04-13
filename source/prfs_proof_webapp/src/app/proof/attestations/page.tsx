import { redirect } from "next/navigation";

import { paths } from "@/paths";

const AttestationsPage = () => {
  redirect(`${paths.attestations}/crypto_1`);
};

export default AttestationsPage;
