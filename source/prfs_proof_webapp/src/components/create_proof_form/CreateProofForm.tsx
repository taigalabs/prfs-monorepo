"use client";

import React from "react";
import Fade from "@taigalabs/prfs-react-lib/src/fade/Fade";
import cn from "classnames";
import { prfsApi3 } from "@taigalabs/prfs-api-js";
import { useSearchParams } from "next/navigation";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { GetPrfsProofTypeByProofTypeIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofTypeByProofTypeIdRequest";
import { CreatePrfsProofAction } from "@taigalabs/prfs-entities/bindings/CreatePrfsProofAction";
import { PrfsProofTypeSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofTypeSyn1";

import styles from "./CreateProofForm.module.scss";
import CreateProofModule from "@/components/create_proof_module/CreateProofModule";
import CreateProofResult from "@/components/create_proof_result/CreateProofResult";
import ProofTypeSelectedMasthead from "@/components/proof_type_selected_masthead/ProofTypeSelectedMasthead";
import { useSelectProofType } from "@/hooks/proofType";
import LeftPadding from "@/components/left_padding/LeftPadding";
import { MastheadPlaceholder } from "@/components/masthead/MastheadComponents";

const CreateProofForm: React.FC = () => {
  const [proofType, setProofType] = React.useState<PrfsProofTypeSyn1>();
  const proofTypeIdRef = React.useRef<string | null>(null);
  const [proveReceipt, setProveReceipt] = React.useState<ProveReceipt | null>(null);
  const [proofAction, setProofAction] = React.useState<CreatePrfsProofAction | null>(null);
  const searchParams = useSearchParams();
  const { mutateAsync: getPrfsProofTypeByProofTypeIdRequest } = useMutation({
    mutationFn: (req: GetPrfsProofTypeByProofTypeIdRequest) => {
      return prfsApi3({ type: "get_prfs_proof_type_by_proof_type_id", ...req });
    },
  });

  React.useEffect(() => {
    async function fn() {
      const proofTypeId = searchParams.get("proof_type_id");

      if (proofTypeId) {
        if (proofTypeIdRef.current && proofTypeIdRef.current !== proofTypeId) {
          setProveReceipt(null);
        }
        proofTypeIdRef.current = proofTypeId;

        const { payload } = await getPrfsProofTypeByProofTypeIdRequest({
          proof_type_id: proofTypeId,
        });

        if (payload) {
          setProofType(payload.prfs_proof_type);
        }
      } else {
      }
    }

    fn().then();
  }, [searchParams, proofTypeIdRef, setProveReceipt]);

  const handleSelectProofType = useSelectProofType();
  const handleCreateProofResult = React.useCallback(
    async (proveReceipt: ProveReceipt) => {
      setProveReceipt(proveReceipt);
    },
    [setProveReceipt],
  );

  const handleClickStartOver = React.useCallback(() => {
    setProveReceipt(null);
  }, [setProveReceipt]);

  return (
    <>
      <ProofTypeSelectedMasthead
        proofInstanceId={undefined}
        proofType={proofType}
        handleSelectProofType={handleSelectProofType}
      />
      <MastheadPlaceholder twoColumn />
      <div className={cn(styles.topRow)}></div>
      <div className={styles.main}>
        <LeftPadding />
        {proofType ? (
          <div className={styles.formWrapper}>
            {proveReceipt ? (
              <Fade>
                <CreateProofResult
                  proofAction={proofAction}
                  proveReceipt={proveReceipt}
                  proofType={proofType}
                  handleClickStartOver={handleClickStartOver}
                />
              </Fade>
            ) : (
              <Fade>
                <CreateProofModule
                  proofType={proofType}
                  handleCreateProofResult={handleCreateProofResult}
                  setProofAction={setProofAction}
                />
              </Fade>
            )}
          </div>
        ) : (
          <div className={styles.loading}>Loading module...</div>
        )}
      </div>
    </>
  );
};

export default CreateProofForm;

export interface ProofTypeItem {
  proofTypeId: string;
  label: string;
  imgUrl: string | null;
}
