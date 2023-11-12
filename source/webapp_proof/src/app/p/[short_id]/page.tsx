// "use client";

import React from "react";
import { redirect } from "next/navigation";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { useQuery } from "@tanstack/react-query";

import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import { getI18N } from "@/i18n/getI18N";

async function getData(shortId: string) {
  const { payload } = await prfsApi2("get_prfs_proof_instance_by_short_id", {
    short_id: shortId,
  });

  return payload;
}

const ShortIdPage: React.FC<ShortIdPageProps> = async ({ params }) => {
  // const i18n = React.useContext(i18nContext);
  const i18n = await getI18N();

  // const { isLoading, data } = useQuery({
  //   queryKey: ["get_prfs_proof_instance_by_short_id"],
  //   queryFn: async () => {
  //     const { payload } = await prfsApi2("get_prfs_proof_instance_by_short_id", {
  //       short_id: params.short_id,
  //     });
  //     return payload;
  //   },
  // });

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
