import { redirect } from "next/navigation";

import { paths } from "@/paths";

const AttestationsPage = () => {
  redirect(paths.sets__crypto_holders);
};

export default AttestationsPage;
