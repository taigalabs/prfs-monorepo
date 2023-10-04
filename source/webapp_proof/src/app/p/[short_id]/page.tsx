"use client";

import React from "react";
import { useRouter, redirect } from "next/navigation";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { useQuery } from "@tanstack/react-query";

import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const ShortIdPage: React.FC<ShortIdPageProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  const { isLoading, data } = useQuery({
    queryKey: ["get_prfs_proof_instance_by_short_id"],
    queryFn: async () => {
      const { payload } = await prfsApi2("get_prfs_proof_instance_by_short_id", {
        short_id: params.short_id,
      });
      return payload;
    },
  });

  if (data) {
    const proofInstanceId = data.prfs_proof_instance.proof_instance_id;
    redirect(`${paths.proofs}/${proofInstanceId}`);
  }

  // React.useEffect(() => {
  //   async function fn() {
  //     if (params.short_id) {
  //       try {
  //         const { payload } = await prfsApi2("get_prfs_proof_instance_by_short_id", {
  //           short_id: params.short_id,
  //         });

  //         if (payload.prfs_proof_instance) {
  //           let proofInstanceId = payload.prfs_proof_instance.proof_instance_id;
  //           router.push(`${paths.proofs}/${proofInstanceId}`);
  //         } else {
  //           throw new Error("Response does not contain proof instance");
  //         }
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     }
  //   }

  //   fn().then();
  // }, [router]);

  return <div>{i18n.redirecting}</div>;
};

export default ShortIdPage;

interface ShortIdPageProps {
  params: {
    short_id: string;
  };
}
