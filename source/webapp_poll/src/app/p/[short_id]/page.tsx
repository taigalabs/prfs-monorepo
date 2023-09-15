"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { prfsApi2 } from "@taigalabs/prfs-api-js";

import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const ShortIdPage: React.FC<ShortIdPageProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  React.useEffect(() => {
    async function fn() {
      // if (params.short_id) {
      //   try {
      //     const { payload } = await prfsApi2("get_prfs_proof_instance_by_short_id", {
      //       short_id: params.short_id,
      //     });
      //     if (payload.prfs_proof_instance) {
      //       let proofInstanceId = payload.prfs_proof_instance.proof_instance_id;
      //       router.push(`${paths.polls}/${proofInstanceId}`);
      //     } else {
      //       throw new Error("Response does not contain proof instance");
      //     }
      //   } catch (err) {
      //     console.error(err);
      //   }
      // }
    }

    fn().then();
  }, [router]);

  return <div>{i18n.redirecting}</div>;
};

export default ShortIdPage;

interface ShortIdPageProps {
  params: {
    short_id: string;
  };
}
