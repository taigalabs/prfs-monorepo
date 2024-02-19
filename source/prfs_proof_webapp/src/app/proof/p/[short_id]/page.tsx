import React from "react";
import { redirect } from "next/navigation";
import { prfsApi2, prfsApi3 } from "@taigalabs/prfs-api-js";

import { paths } from "@/paths";
import { getI18N } from "@/i18n/get_i18n";

async function getData(shortId: string) {
  // const { payload } = await prfsApi2("get_prfs_proof_instance_by_short_id", {
  //   short_id: shortId,
  // });
  const { payload } = await prfsApi3({
    type: "get_prfs_proof_instance_by_short_id",
    short_id: shortId,
  });

  return payload;
}

const ShortIdPage: React.FC<ShortIdPageProps> = async ({ params }) => {
  const i18n = await getI18N();
  const data = await getData(params.short_id);

  if (data) {
    const proofInstanceId = data.prfs_proof_instance.proof_instance_id;
    redirect(`${paths.proofs}/${proofInstanceId}`);
  }

  return <div>{i18n.redirecting}</div>;
};

export default ShortIdPage;

interface ShortIdPageProps {
  params: {
    short_id: string;
  };
}
