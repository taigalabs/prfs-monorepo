import { redirect } from "next/navigation";

import { paths } from "@/paths";

const AttestationsPage = () => {
  redirect(paths.attestations__crypto_asset_size);
};

export default AttestationsPage;
