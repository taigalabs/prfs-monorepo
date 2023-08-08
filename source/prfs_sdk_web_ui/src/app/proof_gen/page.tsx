"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import * as prfsApi from "@taigalabs/prfs-api-js";

import styles from "./Home.module.scss";
import { i18nContext } from "@/contexts/i18n";
import CreateProofForm from "@/components/create_proof_form/CreateProofForm";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";

const ProofGen: React.FC<ProofGenProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);

  const [data, setData] = React.useState();
  const searchParams = useSearchParams();
  const [proofType, setProofType] = React.useState<PrfsProofType>();

  React.useEffect(() => {
    window.addEventListener("message", e => {
      console.log("parent says", e.data);
      setData(e.data);
    });
  }, [setData]);

  React.useEffect(() => {
    async function fn() {
      let proofTypeId = searchParams.get("proofTypeId");
      console.log("proofTypeId: %s", proofTypeId);

      if (proofTypeId) {
        const { payload } = await prfsApi.getPrfsProofTypes({
          page: 0,
          proof_type_id: proofTypeId,
        });

        if (payload.prfs_proof_types.length > 0) {
          setProofType(payload.prfs_proof_types[0]);
        } else {
          console.log("PrfsProofType not found");
        }
      }
    }

    fn().then();
  }, [searchParams, setProofType]);

  return <DefaultLayout>{proofType && <CreateProofForm proofType={proofType} />}</DefaultLayout>;
};

export default ProofGen;

export interface ProofGenProps {
  params: {
    proofTypeId: string;
  };
}
