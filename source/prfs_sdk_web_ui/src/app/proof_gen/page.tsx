"use client";

import React from "react";
import { ethers } from "ethers";
import { Msg } from "@taigalabs/prfs-sdk-web";
import { useRouter, useSearchParams } from "next/navigation";
import * as prfsApi from "@taigalabs/prfs-api-js";

import styles from "./Home.module.scss";
import { i18nContext } from "@/contexts/i18n";
import useLocalWallet from "@/hooks/useLocalWallet";
import CreateProofForm from "@/components/create_proof_form/CreateProofForm";

const ProofGen: React.FC<ProofGenProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);

  const [data, setData] = React.useState();
  const searchParams = useSearchParams();

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

        console.log(33, payload);
      }
    }

    fn().then();
  }, [searchParams]);

  return <div>55</div>;
  // return proof_type_id  />;
};

export default ProofGen;

export interface ProofGenProps {
  params: {
    proofTypeId: string;
  };
}
