import { redirect } from "next/navigation";

import { paths } from "@/paths";

const AttestationsPage = () => {
  redirect(`${paths.attestations}/g/crypto_1`);
};

export default AttestationsPage;
